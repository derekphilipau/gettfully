import * as fs from 'fs';
import * as readline from 'node:readline';
import zlib from 'zlib';
import * as T from '@elastic/elasticsearch/lib/api/types';
import csvParser from 'csv-parser';

import { getClient } from '@/lib/elasticsearch/client';
import {
  bulk,
  forceCreateIndexIfNotExist,
  getBulkOperationArray,
} from '@/lib/elasticsearch/import';

async function* readFileData(
  filename: string
): AsyncGenerator<any, void, unknown> {
  const isJsonl = filename.endsWith('.jsonl');
  const isCompressedJsonl = filename.endsWith('.jsonl.gz');
  const isCsv = filename.endsWith('.csv');
  const isCompressedCsv = filename.endsWith('.csv.gz');

  let inputStream: NodeJS.ReadableStream;
  if (isCompressedJsonl || isCompressedCsv) {
    inputStream = fs.createReadStream(filename).pipe(zlib.createGunzip());
  } else {
    inputStream = fs.createReadStream(filename);
  }

  if (isJsonl || isCompressedJsonl) {
    const fileStream = readline.createInterface({
      input: inputStream,
      crlfDelay: Infinity,
    });
    for await (const line of fileStream) {
      try {
        const obj = JSON.parse(line);
        yield obj;
      } catch (err) {
        console.error(`Error parsing JSON line ${line}: ${err}`);
      }
    }
  } else if (isCsv || isCompressedCsv) {
    const csvStream = inputStream.pipe(csvParser());
    for await (const row of csvStream) {
      yield row;
    }
  } else {
    throw new Error(`Unsupported file format for ${filename}`);
  }
}

/**
 * Update data in Elasticsearch from a jsonl file (one JSON object per row, no endline commas)
 */
export default async function updateFromFile(
  indexName: string,
  indexSettings: T.IndicesIndexSettings,
  dataFilename: string,
  idField: string
) {
  console.log(`Updating ${indexName} from ${dataFilename}...`);
  const bulkLimit = parseInt(process.env.ELASTICSEARCH_BULK_LIMIT || '1000');
  const maxBulkOperations = bulkLimit * 2;
  const client = getClient();
  await forceCreateIndexIfNotExist(client, indexName, indexSettings);
  let operations: any[] = [];

  for await (const doc of readFileData(dataFilename)) {
    try {
      if (doc && doc[idField]) {
        operations.push(
          ...getBulkOperationArray('update', indexName, doc[idField], doc)
        );
      }
    } catch (err) {
      console.error(`Error parsing document ${doc}: ${err}`);
    }

    if (operations.length >= maxBulkOperations) {
      await bulk(client, operations);
      operations = [];
    }
  }
  if (operations.length > 0) {
    await bulk(client, operations);
  }
}
