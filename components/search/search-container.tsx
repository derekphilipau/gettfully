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
import { SearchFilters } from './search-filters';
import { SearchIntro } from './search-intro';
import { SearchPagination } from './search-pagination';

type Props = {};

export function SearchContainer({}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchEmpty, setIsSearchEmpty] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [index, setIndex] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [nationality, setNationality] = useState<string>('');
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [birthPlace, setBirthPlace] = useState<string>('');
  const [deathPlace, setDeathPlace] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const dict = getDictionary();

  function onSearch(q: string) {
    setSearchQuery(q);
  }

  // Resets the page number to 1 whenever any of the search
  // parameters change, EXCEPT for the page number itself.
  useEffect(() => {
    setPageNumber(1);
  }, [
    searchQuery,
    index,
    role,
    gender,
    nationality,
    startYear,
    endYear,
    birthPlace,
    deathPlace,
  ]);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (index) {
      params.append('index', index);
    }
    if (searchQuery) {
      params.append('query', searchQuery);
    }
    if (role) {
      params.append('role', role);
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

    // If params is empty, set is search empty to true:
    if (params.toString() === '') {
      setIsSearchEmpty(true);
      setItems([]);
      setIsLoading(false);
      setPageNumber(1);
      setTotalPages(0);
      return;
    } else {
      setIsSearchEmpty(false);
    }

    if (pageNumber) {
      params.append('pageNumber', pageNumber.toString());
    }

    const currentUrl = `/api/search?${params.toString()}`;

    fetch(currentUrl)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.data);
        setIsLoading(false);
        if (data.metadata?.pages) {
          setTotalPages(data.metadata.pages);
        } else {
          setTotalPages(0);
        }
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        }, 100);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
        setError(error?.message);
        setItems([]);
        setIsLoading(false);
        setTotalPages(0);
        setPageNumber(1);
      });
  }, [
    searchQuery,
    role,
    gender,
    nationality,
    startYear,
    endYear,
    birthPlace,
    deathPlace,
    pageNumber,
    index,
  ]);

  return (
    <section className="">
      <div className="flex flex-col gap-y-2">
        <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:justify-normal">
          <DebouncedInput
            onSearchAsYouTypeChange={onSearch}
            isLoading={isLoading}
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
            defaultValue={index}
            onValueChange={setIndex}
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
          <SearchPagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            onPageNumberChange={setPageNumber}
          />
        </div>
        {isFiltersOpen && (
          <div className="mt-2 sm:mt-0">
            <SearchFilters
              onNationalityChange={setNationality}
              onBirthPlaceChange={setBirthPlace}
              onDeathPlaceChange={setDeathPlace}
              onStartYearChange={setStartYear}
              onEndYearChange={setEndYear}
              onGenderChange={setGender}
              onRoleChange={setRole}
              startYear={startYear}
              endYear={endYear}
              gender={gender}
              role={role}
            />
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
            <SearchPagination
              pageNumber={pageNumber}
              totalPages={totalPages}
              onPageNumberChange={setPageNumber}
            />
          </div>
        </>
      )}
    </section>
  );
}
