import type { Metadata } from 'next';
import type {
  AatSubject,
  ApiSearchResponse,
  GenericSearchParams,
  UlanSubject,
} from '@/types';

import { search } from '@/lib/elasticsearch/api/search';
import { SearchContainer } from '@/components/search/search-container';
import {
  generateSearchMetadata,
  getSanitizedSearchParams,
  isParamsEmpty,
} from '@/components/search/search-params';

export type Props = {
  params: Promise<{ index: string }>;
  searchParams: Promise<GenericSearchParams>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const sanitizedParams = getSanitizedSearchParams(searchParams);
  return generateSearchMetadata(sanitizedParams);
}

export default async function Page(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const sanitizedParams = getSanitizedSearchParams(searchParams);

  let items: (UlanSubject | AatSubject)[] = [];
  let apiError = '';
  let count = 0;
  let totalPages = 0;
  if (!isParamsEmpty(sanitizedParams)) {
    let response = (await search(sanitizedParams)) as ApiSearchResponse;
    items = response?.data || [];
    apiError = response?.error || '';
    count = response?.metadata?.total || 0;
    totalPages = response?.metadata?.pages || 0;
  }

  return (
    <div className="container mx-auto">
      <SearchContainer
        params={sanitizedParams}
        items={items}
        count={count}
        totalPages={totalPages}
        apiError={apiError}
      />
    </div>
  );
}
