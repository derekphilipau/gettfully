'use client';

import { Key, useEffect, useState } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';
import type { AatSubject, UlanSubject } from '@/types';
import { SlidersHorizontalIcon } from 'lucide-react';

import { DebouncedInput } from '@/components/debounced-input';
import { GettySubjectCard } from '@/components/search/getty-subject-card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '../ui/button';
import { SearchFilterButton } from './search-filter-button';
import { SearchFilters } from './search-filters';

type Props = {};

export function SearchContainer({}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [index, setIndex] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [nationality, setNationality] = useState<string>('');
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [birthPlace, setBirthPlace] = useState<string>('');
  const [deathPlace, setDeathPlace] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const dict = getDictionary();
  let errorMessage = dict['search.noResults'];

  function onSearch(q: string) {
    setSearchQuery(q);
  }

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (index) {
      params.append('index', index);
    }
    if (searchQuery) {
      params.append('query', searchQuery);
    }
    if (gender) {
      params.append('gender', gender);
    }
    if (nationality) {
      params.append('nationality', nationality);
    }
    if (startYear) {
      params.append('startYear', startYear);
    }
    if (endYear) {
      params.append('endYear', endYear);
    }
    if (birthPlace) {
      params.append('birthPlace', birthPlace);
    }
    if (deathPlace) {
      params.append('deathPlace', deathPlace);
    }
    const currentUrl = `/api/search?${params.toString()}`;

    fetch(currentUrl)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.data);
        setIsLoading(false);
        console.log('xxx', data.query);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
        setError(error?.message);
        setItems([]);
        setIsLoading(false);
      });
  }, [
    searchQuery,
    gender,
    nationality,
    startYear,
    endYear,
    birthPlace,
    deathPlace,
    index,
  ]);

  return (
    <section className="container pt-2">
      <div className="flex flex-col gap-y-2">
        <div className="flex w-full flex-wrap gap-2">
          <DebouncedInput
            onSearchAsYouTypeChange={onSearch}
            isLoading={isLoading}
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Show Filters"
            className="size-12"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <SlidersHorizontalIcon className="size-5" />
          </Button>
          <RadioGroup
            defaultValue={index}
            onValueChange={setIndex}
            className="mb-2 flex flex-wrap items-center sm:mb-0"
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
        </div>
        {isFiltersOpen && (
          <SearchFilters
            onNationalityChange={setNationality}
            onBirthPlaceChange={setBirthPlace}
            onDeathPlaceChange={setDeathPlace}
            onStartYearChange={setStartYear}
            onEndYearChange={setEndYear}
            onGenderChange={setGender}
            startYear={startYear}
            endYear={endYear}
            gender={gender}
          />
        )}
      </div>
      <div className="mt-4 flex flex-col flex-wrap gap-2">
        {items?.length > 0 &&
          items.map(
            (item: AatSubject | UlanSubject, i: Key) =>
              item && (
                <GettySubjectCard key={item.subjectId} gettySubject={item} />
              )
          )}
        {!(items?.length > 0) && (
          <h3 className="my-10 mb-4 text-lg md:text-xl">{errorMessage}</h3>
        )}
      </div>
    </section>
  );
}
