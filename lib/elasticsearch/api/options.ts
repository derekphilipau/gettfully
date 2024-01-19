import type { ApiSearchResponse } from '@/types';
import * as T from '@elastic/elasticsearch/lib/api/types';

import { getClient } from '../client';

const INDEX_NAME = 'ulan-subjects';
export const OPTIONS_PAGE_SIZE = 40; // results per aggregation options search

/**
 * Get options/buckets for a specific field/agg
 * @param params
 * @param size Number of options to return
 * @returns
 */
export async function options(
  field: string, // Field to get options for
  query?: string | null, // Query string
  size = OPTIONS_PAGE_SIZE
): Promise<ApiSearchResponse> {
  if (!field) {
    throw new Error('Field parameter is required');
  }

  const request: T.SearchRequest = {
    index: INDEX_NAME,
    size: 0,
    aggs: {
      [field]: {
        terms: {
          field,
          size,
        },
      },
    },
  };

  if (query) {
    const wildcardQuery = `*${query}*`;
    request.query = {
      wildcard: {
        [`${field}.search`]: {
          value: wildcardQuery,
        },
      },
    };
  }

  const client = getClient();

  try {
    const response: T.SearchTemplateResponse = await client.search(request);
    if (response.aggregations?.[field] !== undefined) {
      const aggAgg: T.AggregationsAggregate = response.aggregations?.[field];
      if ('buckets' in aggAgg && aggAgg?.buckets) {
        const options = aggAgg.buckets;
        const metadata = {
          total: aggAgg.buckets.length,
        };
        return {
          query: request,
          data: options,
          metadata,
        };
      }
    }
  } catch (e) {
    console.error('Error in Elasticsearch aggregation options:', e);
  }
  return { data: [] };
}
