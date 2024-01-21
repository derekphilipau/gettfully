import { getDictionary } from '@/dictionaries/dictionaries';
import type {
  AatSubject,
  ApiSearchResponse,
  GenericSearchParams,
  UlanSubject,
} from '@/types';

import { search } from '@/lib/elasticsearch/api/search';
import { SearchContainer } from '@/components/search/search-container';
import { getSanitizedSearchParams } from '@/components/search/search-params';

type Props = {
  params: { index: string };
  searchParams: GenericSearchParams;
};

export default async function Page({ params, searchParams }: Props) {
  const sanitizedParams = getSanitizedSearchParams(searchParams);

  // Query Elasticsearch
  let response = (await search(sanitizedParams)) as ApiSearchResponse;
  const items: (UlanSubject | AatSubject)[] = response?.data || [];
  const apiError = response?.error || '';
  const count = response?.metadata?.total || 0;
  const totalPages = response?.metadata?.pages || 0;

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
