import { Client } from '@elastic/elasticsearch';
import * as T from '@elastic/elasticsearch/lib/api/types';

/**
 * Check if a given index already exists in Elasticsearch.
 *
 * @param client Elasticsearch client.
 * @param indexName Name of the index.
 * @returns True if the index exists, false otherwise.
 */
async function existsIndex(
  client: Client,
  indexName: string
): Promise<boolean> {
  return (await client.indices.exists({ index: indexName })) ? true : false;
}

/**
 * Delete an Elasticsearch index.
 *
 * @param client Elasticsearch client.
 * @param indexName Name of the index.
 */
async function deleteIndex(client: Client, indexName: string) {
  if (await existsIndex(client, indexName)) {
    try {
      await client.indices.delete({ index: indexName });
    } catch (err) {
      console.error(`Error deleting index ${indexName}: ${err}`);
    }
  }
}

/**
 * Create an Elasticsearch index.
 *
 * @param client Elasticsearch client.
 * @param indexName Name of the index.
 * @param deleteIndexIfExists Delete the index if it already exists.
 * @param deleteAliasIfExists Delete the alias if it already exists.
 */
export async function createIndex(
  client: Client,
  indexName: string,
  indexSettings: T.IndicesIndexSettings,
  deleteIndexIfExists = false,
  deleteAliasIfExists = true
) {
  if (deleteAliasIfExists) {
    // Check if the index already exists as an alias
    const aliasExists = await client.indices.existsAlias({
      name: indexName,
    });
    if (aliasExists) {
      await deleteAliasIndices(client, indexName);
      console.log(`Deleted existing alias ${indexName}`);
    }
  }
  if (deleteIndexIfExists) {
    await deleteIndex(client, indexName);
    console.log(`Deleted existing index ${indexName}`);
  }

  const indexExists = await existsIndex(client, indexName);
  if (!indexExists) {
    await client.indices.create({
      index: indexName,
      body: indexSettings,
    });
  }
}

export async function createIndexIfNotExist(
  client: Client,
  indexName: string,
  indexSettings: T.IndicesIndexSettings
) {
  return createIndex(client, indexName, indexSettings, false, true);
}

export async function forceCreateIndexIfNotExist(
  client: Client,
  indexName: string,
  indexSettings: T.IndicesIndexSettings
) {
  return createIndex(client, indexName, indexSettings, true, true);
}

/**
 * Completely remove an alias an all current and past indices associated with it.
 *
 * @param client Elasticsearch client.
 * @param aliasName Name of the alias.
 */
export async function deleteAliasIndices(client: Client, aliasName: string) {
  // Get status of OpenSearch:
  const statusResponse: T.IndicesStatsResponse = await client.indices.stats();

  // Remove all old timestamped indices
  if (statusResponse.indices && typeof statusResponse.indices === 'object') {
    for (const timestampedIndexName of Object.keys(statusResponse.indices)) {
      if (aliasName === timestampedIndexName.split('_', 1)[0]) {
        await deleteIndex(client, timestampedIndexName);
        console.log('Deleted index: ' + timestampedIndexName);
      }
    }
  }
}

/**
 * Bulk insert or update documents in an index.
 *
 * @param client Elasticsearch client.
 * @param operations Array of operations to insert or update.
 */
export async function bulk(client: Client, operations: any[]) {
  if (!operations || operations?.length === 0) return;
  const bulkResponse = await client.bulk({ refresh: true, operations });
  if (bulkResponse.errors) {
    console.log(JSON.stringify(bulkResponse, null, 2));
    throw new Error('Bulk operations failed');
  }
  console.log(
    `Bulk ${operations?.length / 2} operations completed in ${
      bulkResponse.took
    }ms`
  );
}

export function getBulkOperationArray(
  method: string,
  index: string,
  id: string | undefined,
  doc: any
): any[] {
  return [
    {
      [method]: {
        _index: index,
        ...(id && { _id: id }),
      },
    },
    method === 'update' ? { doc, doc_as_upsert: true } : { doc },
  ];
}
