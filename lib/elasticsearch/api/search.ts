import type {
  AatSubject,
  AggOptions,
  ApiSearchParams,
  ApiSearchResponse,
  ApiSearchResponseMetadata,
  UlanSubject,
} from '@/types';
import * as T from '@elastic/elasticsearch/lib/api/types';

import { getEnvVar } from '@/lib/utils';
import { getClient } from '../client';
import {
  addDefaultQueryBoolDateRange,
  addQueryAggs,
  addQueryBoolDateRange,
  addQueryBoolFilterExists,
  addQueryBoolFilterTerm,
  addQueryBoolFilterWildcardTerm,
  addQueryBoolYearRange,
  getMatchAllBoolQuery,
  getMultiMatchBoolQuery,
} from './searchQueryBuilder';

export const aggFields = [];

const DEFAULT_INDICES = ['ulan-subjects', 'aat-subjects'];
export const SEARCH_PAGE_SIZE = 20;

/**
 * Search for documents in one or more indices
 *
 * @param searchParams Search parameters
 * @returns Elasticsearch search response
 */
export async function search(
  searchParams: ApiSearchParams
): Promise<(UlanSubject | AatSubject)[] | ApiSearchResponse> {
  let index: string | string[] = DEFAULT_INDICES;
  if (searchParams.index) {
    index = searchParams.index === 'ulan' ? 'ulan-subjects' : 'aat-subjects';
  }
  let size = searchParams.size || SEARCH_PAGE_SIZE;
  let pageNumber = searchParams.pageNumber || 1;

  const isIdSearch =
    searchParams.query?.match(/^\d+$/) && searchParams.query?.length > 4;

  let boolQuery: T.QueryDslQueryContainer =
    searchParams.query && !isIdSearch
      ? getMultiMatchBoolQuery(searchParams.query)
      : //  getMatchAllBoolQuery()
        getMatchAllBoolQuery();

  const esQuery: T.SearchRequest = {
    index,
    query: boolQuery,
    from: (pageNumber - 1) * size || 0,
    size,
    track_total_hits: true,
  };

  if (isIdSearch) {
    addQueryBoolFilterWildcardTerm(
      esQuery,
      'subjectId',
      searchParams.query,
      'prefix'
    );
  }

  if (searchParams.role) {
    addQueryBoolFilterWildcardTerm(esQuery, 'roles.name', searchParams.role);
  }
  if (searchParams.gender) {
    addQueryBoolFilterTerm(esQuery, 'biographies.sex', searchParams.gender);
  }
  if (searchParams.nationality) {
    addQueryBoolFilterWildcardTerm(
      esQuery,
      'nationalities.name',
      searchParams.nationality
    );
  }
  if (searchParams.startYear || searchParams.endYear) {
    addQueryBoolYearRange(
      esQuery,
      searchParams.startYear,
      searchParams.endYear
    );
  }
  if (searchParams.birthPlace) {
    addQueryBoolFilterWildcardTerm(
      esQuery,
      'biographies.birthPlaceName',
      searchParams.birthPlace
    );
  }
  if (searchParams.deathPlace) {
    addQueryBoolFilterWildcardTerm(
      esQuery,
      'biographies.deathPlaceName',
      searchParams.deathPlace
    );
  }

  // console.log(JSON.stringify(esQuery, null, 2));

  const client = getClient();
  const response: T.SearchTemplateResponse = await client.search(esQuery);
  const metadata = getResponseMetadata(response, SEARCH_PAGE_SIZE, 0);
  const options = getResponseAggOptions(response);
  const data = response.hits.hits.map((hit) => hit._source) as UlanSubject[];
  if (searchParams.isMinimal) {
    return data;
  }
  const res: ApiSearchResponse = { query: esQuery, data, options, metadata };
  return res;
}

/**
 * Get the total number of results and the number of pages
 *
 * @param response The response from the ES search
 * @param size The number of results per page
 * @returns Object with the total number of results and the number of pages
 */
function getResponseMetadata(
  response: T.SearchTemplateResponse,
  size: number,
  pageNumber: number = 1
): ApiSearchResponseMetadata {
  let total = response?.hits?.total || 0; // Returns either number or SearchTotalHits
  if (typeof total !== 'number') total = total.value;
  const pages = Math.ceil(total / size);
  return { total, pages, pageNumber };
}

/**
 * Get the options/buckets for each agg in the response
 *
 * @param response The response from the ES search
 * @returns Array of aggregations with options/buckets
 */
function getResponseAggOptions(response: T.SearchTemplateResponse): AggOptions {
  const options: AggOptions = {};
  if (response?.aggregations) {
    Object.keys(response?.aggregations).forEach((field) => {
      if (response.aggregations?.[field] !== undefined) {
        const aggAgg: T.AggregationsAggregate = response.aggregations?.[field];
        if ('buckets' in aggAgg && aggAgg?.buckets)
          options[field] = aggAgg.buckets;
      }
    });
  }
  return options;
}
