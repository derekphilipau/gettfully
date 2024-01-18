import type { GenericSearchParams } from '@/lib/elasticsearch/search/searchParams';
import { SearchContainer } from '@/components/search/search-container';

type Props = {
  params: { index: string };
  searchParams: GenericSearchParams;
};

export default async function Page({ params, searchParams }: Props) {
  return <SearchContainer />;
}
