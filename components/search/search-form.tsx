'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ApiSearchParams } from '@/types';
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SearchFilterTags } from './search-filter-tags';
import { SearchFilters } from './search-filters';
import { SearchPagination } from './search-pagination';
import { getUrlWithParam } from './search-params';

type SearchFormProps = {
  params: ApiSearchParams;
  totalPages: number;
};

export function SearchForm({ params, totalPages }: SearchFormProps) {
  const router = useRouter();
  const [myQuery, setMyQuery] = useState(params.query || '');

  function handleQuerySubmit(event: FormEvent) {
    event.preventDefault();
    router.push(getUrlWithParam(params, 'query', myQuery));
  }

  function onIndexChange(index: string) {
    router.push(getUrlWithParam(params, 'index', index));
  }

  function setShowFilters(value: boolean) {
    router.push(getUrlWithParam(params, 'showFilters', value));
  }

  useEffect(() => {
    setMyQuery(params.query || '');
  }, [params.query]);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:justify-normal">
        <form className="grow" onSubmit={handleQuerySubmit}>
          <div className="flex rounded-md">
            <div className="relative flex grow items-stretch focus-within:z-10">
              <Input
                type="search"
                className="rounded-none rounded-l-md text-lg"
                name="query"
                placeholder="Search..."
                value={myQuery}
                onChange={(e) => setMyQuery(e.target.value)}
                autoComplete="off"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="rounded-none rounded-r-md border border-l-0"
              aria-label="Search"
            >
              <SearchIcon className="size-5" />
            </Button>
          </div>
        </form>
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
      <div
        className={`flex flex-wrap gap-2 ${params.showFilters ? 'hidden' : ''}`}
      >
        <SearchFilterTags params={params} />
      </div>
    </div>
  );
}
