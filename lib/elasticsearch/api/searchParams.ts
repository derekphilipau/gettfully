import { aggFields } from '../config/indexSettings';
import type { ApiSearchParams, SortOrder } from '@/types';
import { convertDateToUTC } from '@/lib/time';

/**
 * Encapsulates & validates search parameters.
 */
export const DEFAULT_SEARCH_PAGE_SIZE = 24;
export const MAX_SEARCH_PAGE_SIZE = 100;
export const MAX_PAGES = 1000; // Don't allow more than 1000 pages of results
export const SORT_ORDER_ASC: SortOrder = 'asc';
export const SORT_ORDER_DESC: SortOrder = 'desc';
export const SORT_ORDER_DEFAULT = SORT_ORDER_ASC;
export const SORT_ORDERS = [SORT_ORDER_ASC, SORT_ORDER_DESC];

function parseInteger(value: string | string[] | undefined, defaultValue: number): number {
  if (!(typeof value === 'string')) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return !isNaN(parsed) ? parsed : defaultValue;
}

function parseString(value: string | string[] | undefined, defaultValue = ''): string {
  return typeof value === 'string' ? value : defaultValue;
}

// Type: See: https://github.com/vercel/next.js/discussions/46131
export type GenericSearchParams = {
  [key: string]: string | string[] | undefined;
};

/**
 * Validate and transform raw search parameters.
 *
 * @param params - Raw query string parameters.
 * @returns Validated and transformed search parameters.
 */
export function getSanitizedSearchParams(params: GenericSearchParams): ApiSearchParams {
  const sanitizedParams: Partial<ApiSearchParams> = {};

  // page number between 1 and MAX_PAGES
  const pageNumber = parseInteger(params.page, 1);
  sanitizedParams.pageNumber =
    pageNumber && pageNumber > 0 && pageNumber <= MAX_PAGES ? pageNumber : 1;

  // size (number of results shown per page)
  const size = parseInteger(params.size, DEFAULT_SEARCH_PAGE_SIZE);
  sanitizedParams.size =
    size && size > 0 && size < MAX_SEARCH_PAGE_SIZE ? size : DEFAULT_SEARCH_PAGE_SIZE;

  // sort field & order
  sanitizedParams.sortField = parseString(params.sortField);
  sanitizedParams.sortOrder = SORT_ORDERS.includes(params.sortOrder as SortOrder)
    ? (params.sortOrder as SortOrder)
    : SORT_ORDER_DEFAULT;

  // search query
  sanitizedParams.query = parseString(params.query);

  // search filters
  for (const aggField of aggFields) {
    if (parseString(params[aggField])) {
      sanitizedParams[aggField] = parseString(params[aggField]);
    }
  }

  if (params.visible === 'true') {
    sanitizedParams.visible = true;
  }
  if (params.publicAccess === 'true') {
    sanitizedParams.publicAccess = true;
  }
  if (params.rawSource === 'true') {
    sanitizedParams.rawSource = true;
  }
  if (params.hasImage === 'true') {
    sanitizedParams.hasImage = true;
  }
  if (params.isNow === 'true') {
    sanitizedParams.isNow = true;
  }

  // date/year ranges
  const utcStartDate = convertDateToUTC(parseString(params.startDate));
  if (utcStartDate) {
    sanitizedParams.startDate = utcStartDate;
  }
  const utcEndDate = convertDateToUTC(parseString(params.endDate));
  if (utcEndDate) {
    sanitizedParams.endDate = utcEndDate;
  }
  // Note that start/end year might be negative or zero
  if (typeof params.startYear === 'string') {
    sanitizedParams.startYear = parseInt(params.startYear);
  }
  if (typeof params.endYear === 'string') {
    sanitizedParams.endYear = parseInt(params.endYear);
  }

  sanitizedParams.language = parseString(params.language);

  return sanitizedParams as ApiSearchParams;
}
