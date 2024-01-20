import * as T from '@elastic/elasticsearch/lib/api/types';
import { format, formatISO } from 'date-fns';

const aggFields = [];
const SEARCH_AGG_SIZE = 100;

export function getMultiMatchBoolQuery(
  query: string
): T.QueryDslQueryContainer {
  return {
    bool: {
      must: [
        {
          multi_match: {
            query: query,
            fields: ['terms.term.suggest'],
            type: 'best_fields',
            fuzziness: 'AUTO',
          },
        },
      ],
    },
  };
}

export function getMatchAllBoolQuery(): T.QueryDslQueryContainer {
  return {
    bool: {
      must: [
        {
          match_all: {},
        },
      ],
    },
  };
}

export function addQueryAggs(esQuery: any) {
  const aggs: any = {};
  for (const aggName of aggFields) {
    aggs[aggName] = {
      terms: {
        field: aggName,
        size: SEARCH_AGG_SIZE,
      },
    };
  }
  esQuery.aggs = aggs;
}

export function addQueryBoolFilter(
  esQuery: any,
  filter: T.QueryDslQueryContainer
): void {
  if (esQuery.query.bool) {
    // Simple match_all bool query
    esQuery.query.bool.filter ??= [];
    esQuery.query.bool.filter.push(filter);
  } else {
    // Function score bool query for user search query
    esQuery.query.function_score.query.bool.filter ??= [];
    esQuery.query.function_score.query.bool.filter.push(filter);
  }
}

/**
 * Add a term to a bool filter query
 *
 * @param esQuery   The ES query
 * @param name    The name of the field to filter on
 * @param value   The value to filter on
 * @returns  Void.  The ES Query is modified in place
 */
export function addQueryBoolFilterTerm(
  esQuery: any,
  name: string,
  value: string | boolean | number | undefined
): void {
  if (!value) return;
  addQueryBoolFilter(esQuery, {
    term: {
      [name]: value,
    },
  });
}

/**
 * Add a term to a bool filter query
 *
 * @param esQuery   The ES query
 * @param name    The name of the field to filter on
 * @param value   The value to filter on
 * @returns  Void.  The ES Query is modified in place
 */
export function addQueryBoolFilterWildcardTerm(
  esQuery: any,
  name: string,
  value: string | boolean | number | undefined,
  type: 'prefix' | 'suffix' | 'both' = 'both'
): void {
  if (!value) return;
  let wildcardValue = `*${value}*`;
  if (type === 'prefix') {
    wildcardValue = `${value}*`;
  } else if (type === 'suffix') {
    wildcardValue = `*${value}`;
  }
  addQueryBoolFilter(esQuery, {
    wildcard: {
      [name]: {
        value: wildcardValue,
        case_insensitive: true,
      },
    },
  });
}

/**
 * Add an exists clause to a bool filter query
 *
 * @param esQuery   The ES query
 * @param name    The name of the field to filter on
 * @returns  Void.  The ES Query is modified in place
 */
export function addQueryBoolFilterExists(esQuery: any, name: string): void {
  addQueryBoolFilter(esQuery, {
    exists: {
      field: name,
    },
  });
}

/**
 * For the default date range query, we only want documents (events) that
 * have already started OR have no start date.
 * @param esQuery
 * @param searchParams
 */
export function addDefaultQueryBoolDateRange(esQuery: any) {
  addQueryBoolFilter(esQuery, {
    bool: {
      should: [
        {
          range: {
            startDate: {
              lte: format(new Date(), 'yyyy-MM-dd'),
            },
          },
        },
        {
          bool: {
            must_not: {
              exists: {
                field: 'startDate',
              },
            },
          },
        },
      ],
      minimum_should_match: 1,
    },
  });
}

export function addQueryBoolDateRange(
  esQuery: any,
  startDate: Date | undefined,
  endDate: Date | undefined
) {
  if (startDate) {
    addQueryBoolFilter(esQuery, {
      range: {
        startDate: {
          lte: formatISO(startDate, { representation: 'date' }),
        },
      },
    });
  }
  if (endDate) {
    addQueryBoolFilter(esQuery, {
      range: {
        endDate: {
          gte: formatISO(endDate, { representation: 'date' }),
        },
      },
    });
  }
}

/**
 * Currently only supports year ranges
 *
 * @param esQuery The ES query to modify in place
 * @param searchParams The search params
 */
export function addQueryBoolYearRange(
  esQuery: any,
  startYear: number | undefined,
  endYear: number | undefined
) {
  if (
    startYear !== undefined &&
    endYear !== undefined &&
    startYear <= endYear
  ) {
    addQueryBoolFilter(esQuery, {
      range: {
        'biographies.birthDate': {
          gte: startYear,
          lte: endYear,
        },
      },
    });
    addQueryBoolFilter(esQuery, {
      range: {
        'biographies.deathDate': {
          gte: startYear,
          lte: endYear,
        },
      },
    });
  } else if (startYear !== undefined) {
    addQueryBoolFilter(esQuery, {
      range: {
        'biographies.birthDate': {
          gte: startYear,
        },
      },
    });
  } else if (endYear !== undefined) {
    addQueryBoolFilter(esQuery, {
      range: {
        'biographies.deathDate': {
          lte: endYear,
        },
      },
    });
  }
}
