import * as T from '@elastic/elasticsearch/lib/api/types';

import type { ApiSearchResponse, ElasticsearchDocument } from '@/types';
import { client } from '../client';
import { getEnvVar } from '@/lib/utils';

const INDEX_NAME = getEnvVar('SEARCH_ELASTIC_INDEX_NAME');
const MAX_SUGGESTIONS = 10; // Maximum number of suggestions to return

/**
 * Use Elasticsearch search-as-you-type to search terms:
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html
 *
 * @param params contains 'query' string representing query
 * @returns ApiSearchResponse object containing query and data
 */
export async function searchAsYouType(query?: string | null): Promise<ApiSearchResponse> {
  const sanitizedQuery = query?.trim();
  if (!sanitizedQuery) return { data: [] };

  const esQuery: T.SearchRequest = {
    index: INDEX_NAME,
    query: {
      function_score: {
        query: {
          multi_match: {
            query: sanitizedQuery,
            type: 'bool_prefix',
            fields: ['title.suggest', 'title.suggest._2gram', 'title.suggest._3gram'],
          },
        },
        functions: [
          {
            // Rank artists higher than other types:
            filter: { term: { type: 'collectionArtist' } },
            weight: 2,
          },
          {
            // Rank pages, exhibitions higher:
            filter: { terms: { type: ['exhibition', 'page'] } },
            weight: 1.5,
          },
        ],
        boost_mode: 'multiply',
      },
    },
    _source: ['type', 'title', 'url'],
    size: MAX_SUGGESTIONS,
  };

  const response: T.SearchTemplateResponse = await client.search(esQuery);
  const data = response.hits.hits.map((h) => h._source as ElasticsearchDocument);
  const total =
    typeof response.hits?.total === 'number' ? response.hits?.total : response.hits?.total?.value;

  const metadata = {
    total: total,
  };
  const res: ApiSearchResponse = { query: esQuery, data, metadata };
  return res;
}
