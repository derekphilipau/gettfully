/**
 * Encapsulates & validates search parameters.
 */

// Don't allow more than 1000 pages of results
import type { Metadata } from 'next';
import type { ApiSearchParams } from '@/types';

export const MAX_SEARCH_PAGE_SIZE = 100;
export const MAX_PAGES = 1000;

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
export function getSanitizedSearchParams(
  params: GenericSearchParams
): ApiSearchParams {
  const sanitizedParams: ApiSearchParams = {};

  const pageNumber = getIntParam(params, 'pageNumber');
  if (pageNumber && pageNumber > 0 && pageNumber <= MAX_PAGES) {
    sanitizedParams.pageNumber = pageNumber;
  }

  const size = getIntParam(params, 'size');
  if (size && size > 0 && size < MAX_SEARCH_PAGE_SIZE) {
    sanitizedParams.size = size;
  }

  sanitizedParams.index = getStringParam(params, 'index');
  sanitizedParams.query = getStringParam(params, 'query');
  sanitizedParams.role = getStringParam(params, 'role');
  sanitizedParams.gender = getStringParam(params, 'gender');
  sanitizedParams.nationality = getStringParam(params, 'nationality');
  sanitizedParams.startYear = getIntParam(params, 'startYear');
  sanitizedParams.endYear = getIntParam(params, 'endYear');
  sanitizedParams.birthPlace = getStringParam(params, 'birthPlace');
  sanitizedParams.deathPlace = getStringParam(params, 'deathPlace');
  sanitizedParams.showFilters = params.showFilters === 'true';

  return sanitizedParams as ApiSearchParams;
}

/**
 * Convert search parameters to URL query parameters for client-side navigation.
 *
 * Only set parameters that differ from the default values.
 *
 * @param searchParams - The search parameters.
 * @returns The URLSearchParams object.
 */
export function toURLSearchParams(
  searchParams?: ApiSearchParams
): URLSearchParams {
  const urlParams = new URLSearchParams();

  if (!searchParams) return urlParams;

  if (searchParams.pageNumber && searchParams.pageNumber > 1)
    urlParams.set('pageNumber', searchParams.pageNumber.toString());

  if (
    searchParams.size &&
    searchParams.size > 0 &&
    searchParams.size < MAX_SEARCH_PAGE_SIZE
  ) {
    urlParams.set('size', searchParams.size.toString());
  }

  if (searchParams.index) urlParams.set('index', searchParams.index);
  if (searchParams.query) urlParams.set('query', searchParams.query);
  if (searchParams.role) urlParams.set('role', searchParams.role);
  if (searchParams.gender) urlParams.set('gender', searchParams.gender);
  if (searchParams.nationality)
    urlParams.set('nationality', searchParams.nationality);
  if (searchParams.startYear)
    urlParams.set('startYear', searchParams.startYear.toString());
  if (searchParams.endYear)
    urlParams.set('endYear', searchParams.endYear.toString());
  if (searchParams.birthPlace)
    urlParams.set('birthPlace', searchParams.birthPlace);
  if (searchParams.deathPlace)
    urlParams.set('deathPlace', searchParams.deathPlace);
  if (searchParams.showFilters === true) urlParams.set('showFilters', 'true');

  return urlParams;
}

export function isParamsEmpty(params: ApiSearchParams): boolean {
  if (
    params.index ||
    params.query ||
    params.role ||
    params.gender ||
    params.nationality ||
    params.startYear ||
    params.endYear ||
    params.birthPlace ||
    params.deathPlace
  )
    return false;
  return true;
}

export function getUrlWithParam(
  searchParams: ApiSearchParams,
  key: string,
  value: string | number | boolean | undefined
): string {
  const params = { ...searchParams };
  if (value === undefined) {
    delete params[key];
  } else {
    params[key] = value;
  }
  params.pageNumber = 1;
  return `/?${toURLSearchParams(params)}`;
}

/**
 * Immutable update of the search query in the search parameters.
 *
 * @param searchParams - The current search parameters.
 * @param pageNumber - The new page number.
 * @returns New search parameters.
 */
export function getUrlWithPageNumber(
  searchParams: ApiSearchParams,
  pageNumber: number
): string {
  const params = { ...searchParams };
  params.pageNumber = 1;
  if (pageNumber > 0 && pageNumber < MAX_PAGES) {
    params.pageNumber = pageNumber;
  }
  return `/?${toURLSearchParams(params)}`;
}

/**
 * Immutable toggle the show filters flag in search parameters.
 *
 * @param searchParams - The current search parameters.
 * @returns New search parameters.
 */
export function toggleIsShowFilters(
  searchParams: ApiSearchParams
): ApiSearchParams {
  const params = { ...searchParams };
  params.isShowFilters = !params.isShowFilters;
  return params;
}

/**
 * Immutable update of start & end years in search parameters.
 * Note that years can be negative to indicate B.C.E.
 *
 * @param params search params
 * @param startYear string representing year, can be negative
 * @param endYear string representing year, can be negative
 * @returns
 */
export function setYearRange(
  params: ApiSearchParams,
  startYear?: number | null,
  endYear?: number | null
): ApiSearchParams {
  const updatedParams = { ...params };
  updatedParams.startYear = startYear || undefined;
  updatedParams.endYear = endYear || undefined;
  updatedParams.pageNumber = 1;
  return updatedParams;
}

export function getStringParam(
  params: GenericSearchParams,
  key: string
): string | undefined {
  return params[key] !== undefined &&
    params[key] !== '' &&
    typeof params[key] === 'string'
    ? (params[key] as string).trim()
    : undefined;
}

export function getIntParam(
  params: GenericSearchParams,
  key: string
): number | undefined {
  return params[key] !== undefined &&
    params[key] !== '' &&
    typeof params[key] === 'string'
    ? parseInt(params[key] as string, 10)
    : undefined;
}

/**
 * Generate metadata for the search page based on search parameters
 *
 * @param params - The sanitized search parameters
 * @returns Metadata object for the page
 */
export function generateSearchMetadata(params: ApiSearchParams): Metadata {
  // Default metadata
  const metadata: Metadata = {
    title: 'Search | gettfully',
    description: 'Search the Getty vocabulary databases',
  };

  // If search is empty, return default metadata
  if (isParamsEmpty(params)) {
    return metadata;
  }

  // Construct a descriptive title based on search parameters
  let title = 'Search';
  let description = 'Results for';

  // Add index information (ULAN or AAT)
  if (params.index) {
    const indexType = params.index === 'ulan' ? 'ULAN' : 'AAT';
    title = `${indexType} ${title}`;
    description += ` ${indexType}`;
  }

  // Add query term if present
  if (params.query) {
    title = `${params.query} - ${title}`;
    description += ` "${params.query}"`;
  }

  // Add filters information to description
  if (params.role) {
    description += `, role: ${params.role}`;
  }
  if (params.gender) {
    description += `, gender: ${params.gender}`;
  }
  if (params.nationality) {
    description += `, nationality: ${params.nationality}`;
  }
  if (params.birthPlace) {
    description += `, birth place: ${params.birthPlace}`;
  }
  if (params.deathPlace) {
    description += `, death place: ${params.deathPlace}`;
  }
  if (params.startYear && params.endYear) {
    description += `, years: ${params.startYear}-${params.endYear}`;
  } else if (params.startYear) {
    description += `, from year: ${params.startYear}`;
  } else if (params.endYear) {
    description += `, until year: ${params.endYear}`;
  }

  // Add pagination info if not on first page
  if (params.pageNumber && params.pageNumber > 1) {
    title = `${title} (Page ${params.pageNumber})`;
    description += ` - Page ${params.pageNumber}`;
  }

  return { title, description, openGraph: { title, description } };
}
