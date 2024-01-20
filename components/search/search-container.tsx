'use client';

import { Key, useEffect, useState } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';
import type { AatSubject, GettySubject, UlanSubject } from '@/types';

import { DebouncedInput } from '@/components/debounced-input';
import { GettySubjectCard } from '@/components/search/getty-subject-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OptionsCombobox } from './options-combobox';

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
        <div className="flex w-full flex-wrap gap-4">
          <DebouncedInput
            onSearchAsYouTypeChange={onSearch}
            isLoading={isLoading}
          />
          <RadioGroup
            defaultValue={index}
            onValueChange={setIndex}
            className="mb-2 flex flex-wrap items-center sm:mb-0"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="r1" />
              <Label htmlFor="r1">All Vocabularies</Label>
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
        <div className=" flex flex-wrap gap-2">
          <OptionsCombobox
            title="Nationality"
            field="nationalities.name"
            onChange={setNationality}
          />
          <OptionsCombobox
            title="Birthplace"
            field="biographies.birthPlaceName"
            onChange={setBirthPlace}
          />
          <OptionsCombobox
            title="Deathplace"
            field="biographies.deathPlaceName"
            onChange={setDeathPlace}
          />
          <div className="">
            <Input
              id="startYear"
              placeholder="Born After"
              className="w-28"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
            />
          </div>
          <div className="">
            <Input
              id="endYear"
              placeholder="Died Before"
              className="w-28"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
            />
          </div>
          <RadioGroup
            defaultValue={gender}
            onValueChange={setGender}
            className="flex h-10 flex-wrap items-center"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="r1" />
              <Label htmlFor="r1">All Genders</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="M" id="r2" />
              <Label htmlFor="r2">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="F" id="r3" />
              <Label htmlFor="r3">Female</Label>
            </div>
          </RadioGroup>
        </div>
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
