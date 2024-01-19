import type {
  AggOptions,
  ApiSearchParams,
  ApiSearchResponse,
  ApiSearchResponseMetadata,
  ElasticsearchDocument,
} from '@/types';
import * as T from '@elastic/elasticsearch/lib/api/types';
import { add } from 'date-fns';

import { getEnvVar } from '@/lib/utils';
import { getClient } from '../client';
import {
  addDefaultQueryBoolDateRange,
  addQueryAggs,
  addQueryBoolDateRange,
  addQueryBoolFilterExists,
  addQueryBoolFilterTerm,
  addQueryBoolFilterWildcardTerm,
  addQueryBoolLanguage,
  addQueryBoolYearRange,
  getMatchAllBoolQuery,
  getMultiMatchBoolQuery,
} from './searchQueryBuilder';

export const aggFields = [];

const INDEX_NAME = 'ulan-subjects';

/**
 * Search for documents in one or more indices
 *
 * @param searchParams Search parameters
 * @returns Elasticsearch search response
 */
export async function search(
  searchParams: ApiSearchParams
): Promise<ApiSearchResponse> {
  let boolQuery: T.QueryDslQueryContainer = searchParams.query
    ? getMultiMatchBoolQuery(searchParams.query)
    : //  getMatchAllBoolQuery()
      getMatchAllBoolQuery();

  const esQuery: T.SearchRequest = {
    index: INDEX_NAME,
    query: boolQuery,
    from: 0,
    size: 24,
    track_total_hits: true,
  };

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

  /*
  // Add search filters:
  for (const aggField of aggFields) {
    if (searchParams[aggField]) {
      addQueryBoolFilterTerm(esQuery, aggField, searchParams[aggField]);
    }
  }
  if (searchParams.visible === true) {
    addQueryBoolFilterTerm(esQuery, 'visible', true);
  }
  if (searchParams.publicAccess === true) {
    addQueryBoolFilterTerm(esQuery, 'publicAccess', true);
  }

  if (searchParams.hasImage === true) {
    addQueryBoolFilterExists(esQuery, 'imageUrl');
  }

  if (searchParams.language) {
    addQueryBoolLanguage(esQuery, searchParams.language);
  }

  // Date ranges
  if (!searchParams.type) {
    // Default search has special date range filter
    // addDefaultQueryBoolDateRange(esQuery, searchParams);  TODO
  }

  if (searchParams.isNow) {
    // Find Events & Exhibitions search that are going on right now
    addQueryBoolDateRange(esQuery, new Date(), new Date());
  }

  if (searchParams.startDate || searchParams.endDate) {
    addQueryBoolDateRange(
      esQuery,
      searchParams.startDate,
      searchParams.endDate
    );
  }

  if (searchParams.startYear || searchParams.endYear) {
    addQueryBoolYearRange(
      esQuery,
      searchParams.startYear,
      searchParams.endYear
    );
  }

  // Add sort
  if (searchParams.sortField && searchParams.sortOrder) {
    esQuery.sort = [{ [searchParams.sortField]: searchParams.sortOrder }];
  } else {
    // Collection objects don't have a startDate (to account for BCE), so sort by startYear
    // first, then startDate (so that both objects and events/exhibitions are sorted)
    esQuery.sort = [{ startYear: 'desc' }, { startDate: 'desc' }];
  }

  // Include aggregations
  addQueryAggs(esQuery);

  // Remove rawSource and searchText from response
  if (!searchParams.rawSource) {
    esQuery._source = {
      excludes: ['rawSource', 'searchText'],
    };
  } else {
    esQuery._source = {
      excludes: ['searchText'],
    };
  }
  */
  console.log(JSON.stringify(esQuery, null, 2));

  const client = getClient();
  const response: T.SearchTemplateResponse = await client.search(esQuery);
  const metadata = getResponseMetadata(response, 24, 0);
  const options = getResponseAggOptions(response);
  const data = response.hits.hits.map(
    (hit) => hit._source
  ) as ElasticsearchDocument[];
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
