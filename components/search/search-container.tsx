import { Key } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';
import type { AatSubject, ApiSearchParams, UlanSubject } from '@/types';

import { GettySubjectCard } from '@/components/search/getty-subject-card';
import { SearchForm } from './search-form';
import { SearchIntro } from './search-intro';
import { SearchPagination } from './search-pagination';
import { isParamsEmpty } from './search-params';
import { SearchSummary } from './search-summary';

type SearchContainerProps = {
  params: ApiSearchParams;
  items: (UlanSubject | AatSubject)[];
  count: number;
  totalPages: number;
  apiError?: string;
};

export function SearchContainer({
  params,
  items,
  count,
  totalPages,
  apiError,
}: SearchContainerProps) {
  const dict = getDictionary();

  const isSearchEmpty = isParamsEmpty(params);

  return (
    <section className="">
      <SearchForm params={params} totalPages={totalPages} />
      <SearchSummary params={params} count={count} totalPages={totalPages} />
      {isSearchEmpty ? (
        <div className="my-6 flex w-full justify-center">
          <SearchIntro />
        </div>
      ) : (
        <>
          <div className="mt-2 flex flex-col flex-wrap gap-1 sm:gap-2">
            {items?.length > 0 &&
              items.map(
                (item: AatSubject | UlanSubject, i: Key) =>
                  item && (
                    <GettySubjectCard
                      key={item.subjectId}
                      gettySubject={item}
                    />
                  )
              )}
            {!(items?.length > 0) && (
              <h3 className="py-4 text-lg md:text-xl">
                {dict['search.noResults']}
              </h3>
            )}
          </div>
          <div className="mt-4 flex flex-wrap w-full justify-between items-center">
            <SearchSummary
              params={params}
              count={count}
              totalPages={totalPages}
            />
            <SearchPagination params={params} totalPages={totalPages} />
          </div>
        </>
      )}
    </section>
  );
}
