'use client';

import { Key, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import type { AatSubject, ApiSearchParams, UlanSubject } from '@/types';
import { SlidersHorizontalIcon } from 'lucide-react';

import { DebouncedInput } from '@/components/debounced-input';
import { GettySubjectCard } from '@/components/search/getty-subject-card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '../ui/button';
import { SearchFilters } from './search-filters';
import { SearchIntro } from './search-intro';
import { SearchPagination } from './search-pagination';
import { getUrlWithParam, isParamsEmpty } from './search-params';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const router = useRouter();
  const dict = getDictionary();

  const isSearchEmpty = isParamsEmpty(params);

  function onQueryChange(query: string) {
    router.push(getUrlWithParam(params, 'query', query));
  }

  function onIndexChange(index: string) {
    router.push(getUrlWithParam(params, 'index', index));
  }

  return (
    <section className="">
      <div className="flex flex-col gap-y-2">
        <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:justify-normal">
          <DebouncedInput
            onSearchAsYouTypeChange={onQueryChange}
            isLoading={isLoading}
            value={params.query}
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Show Filters"
            className="size-10"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <SlidersHorizontalIcon className="size-5" />
          </Button>
          <RadioGroup
            defaultValue={params.index || ''}
            onValueChange={onIndexChange}
            className="flex flex-wrap items-center"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="r1" />
              <Label htmlFor="r1">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ulan" id="r2" />
              <Label htmlFor="r2">ULAN</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aat" id="r3" />
              <Label htmlFor="r3">AAT</Label>
            </div>
          </RadioGroup>
          <SearchPagination params={params} totalPages={totalPages} />
        </div>
        {isFiltersOpen && (
          <div className="mt-2 sm:mt-0">
            <SearchFilters params={params} />
          </div>
        )}
      </div>
      {isSearchEmpty ? (
        <div className="my-6 flex w-full justify-center">
          <SearchIntro />
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-col flex-wrap gap-1 sm:gap-2">
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
            {!(items?.length > 0) && !isLoading && (
              <h3 className="py-4 text-lg md:text-xl">
                {dict['search.noResults']}
              </h3>
            )}
          </div>
          <div className="mt-4 flex w-full justify-end">
            <SearchPagination params={params} totalPages={totalPages} />
          </div>
        </>
      )}
    </section>
  );
}
