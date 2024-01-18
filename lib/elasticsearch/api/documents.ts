import type { ElasticsearchDocument, ApiSearchResponse } from '@/types';
import { getClient } from '../client';
import { getEnvVar } from '@/lib/utils';

/**
 * Get document(s) by Elasticsearch id
 *
 * @param id ID or array of IDs of document(s) to search for
 * @returns ApiSearchResponse containing data array of documents
 */
export async function getDocuments(id: string | string[]): Promise<ApiSearchResponse> {
  const client = getClient();
  const index = getEnvVar('SEARCH_ELASTIC_INDEX_NAME');

  if (!id) {
    throw new Error('id or array of id is required');
  }

  if (!Array.isArray(id)) {
    id = [id];
  }

  // Returns either GetGetResult or MgetMultiGetError for each document
  const response = await client.mget({
    index,
    body: { ids: id },
  });

  const data = response.docs.flatMap((doc) => {
    if ('found' in doc && doc.found) {
      return [
        {
          _id: doc._id,
          _index: doc._index,
          ...(doc._source || {}),
        },
      ] as ElasticsearchDocument[];
    } else if ('error' in doc && doc.error) {
      console.error(`Error fetching document with ID ${doc._id}: ${doc.error}`);
      return [];
    }
    return [];
  });

  return { data } as ApiSearchResponse;
}
