'use client';

import { useRouter } from 'next/navigation';
import type { ApiSearchParams } from '@/types';
import { SlidersHorizontalIcon } from 'lucide-react';

import { DebouncedInput } from '@/components/debounced-input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '../ui/button';
import { SearchFilters } from './search-filters';
import { SearchPagination } from './search-pagination';
import { getUrlWithParam, isParamsEmpty } from './search-params';

type SearchFormProps = {
  params: ApiSearchParams;
  totalPages: number;
};

export function SearchForm({ params, totalPages }: SearchFormProps) {
  const router = useRouter();

  function onQueryChange(query: string) {
    router.push(getUrlWithParam(params, 'query', query));
  }

  function onIndexChange(index: string) {
    router.push(getUrlWithParam(params, 'index', index));
  }

  function setShowFilters(value: boolean) {
    router.push(getUrlWithParam(params, 'showFilters', value));
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:justify-normal">
        <DebouncedInput
          onSearchAsYouTypeChange={onQueryChange}
          value={params.query}
        />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Show Filters"
          className="size-10"
          onClick={() => setShowFilters(!params.showFilters)}
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
      <div className={`mt-2 sm:mt-0 ${params.showFilters ? '' : 'hidden'}`}>
        <SearchFilters params={params} />
      </div>
    </div>
  );
}
