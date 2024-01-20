import type { GenericSearchParams } from '@/types';

import { SearchContainer } from '@/components/search/search-container';

type Props = {
  params: { index: string };
  searchParams: GenericSearchParams;
};

export default async function Page({ params, searchParams }: Props) {
  return (
    <div className="md:container md:mx-auto">
      <SearchContainer />
    </div>
  );
}
