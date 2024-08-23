import { getDictionary } from '@/dictionaries/dictionaries';
import { ApiSearchParams } from '@/types';

type SearchSummaryProps = {
  params: ApiSearchParams;
  count: number;
  totalPages: number;
};

export function SearchSummary({
  params,
  count,
  totalPages,
}: SearchSummaryProps) {
  if (count === 0) return null;

  const dict = getDictionary();
  const pageNumber = params.pageNumber || 1;

  return (
    <div className="text-sm text-muted-foreground italic">
      {count} {dict['search.resultsPage']} {pageNumber} {dict['search.of']}{' '}
      {totalPages}
    </div>
  );
}
