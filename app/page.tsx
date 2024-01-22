import type {
  AatSubject,
  ApiSearchResponse,
  GenericSearchParams,
  UlanSubject,
} from '@/types';

import { search } from '@/lib/elasticsearch/api/search';
import { SearchContainer } from '@/components/search/search-container';
import {
  getSanitizedSearchParams,
  isParamsEmpty,
} from '@/components/search/search-params';

type Props = {
  params: { index: string };
  searchParams: GenericSearchParams;
};

export default async function Page({ params, searchParams }: Props) {
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
