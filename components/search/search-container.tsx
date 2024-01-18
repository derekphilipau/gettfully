'use client';

import { Key, useEffect, useState } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';
import { set } from 'date-fns';

import { UlanSubjectCard } from '@/components/search/ulan-subject-card';
import { DebouncedInput } from '@/components/searchold/debounced-input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OptionsCombobox } from './options-combobox';
import { SearchAsYouTypeOptionsInput } from './search-as-you-type-options-input';

type Props = {};

export function SearchContainer({}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [nationality, setNationality] = useState<string>('');
  const dict = getDictionary();
  let errorMessage = dict['search.noResults'];

  function onSearch(q: string) {
    setSearchQuery(q);
  }

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('query', searchQuery);
    }
    if (gender) {
      params.append('gender', gender);
    }
    if (nationality) {
      params.append('nationality', nationality);
    }
    const currentUrl = `/api/search?${params.toString()}`;
    console.log('xxx', currentUrl);
    fetch(currentUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data);
        setItems(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
        setError(error?.message);
        setItems([]);
        setIsLoading(false);
      });
  }, [searchQuery, gender, nationality]);

  return (
    <section className="container pt-2">
      <div className="flex flex-col gap-y-2">
        <DebouncedInput
          onSearchAsYouTypeChange={onSearch}
          isLoading={isLoading}
        />
        <div className="flex flex-wrap gap-2">
          <RadioGroup
            defaultValue={gender}
            onValueChange={setGender}
            className="flex flex-wrap items-center"
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
          <OptionsCombobox
            title="Nationality"
            field="nationalities.name"
            onChange={setNationality}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-col flex-wrap gap-2">
        {items?.length > 0 &&
          items.map(
            (item: any, i: Key) =>
              item && <UlanSubjectCard key={i} ulanSubject={item} />
          )}
        {!(items?.length > 0) && (
          <h3 className="my-10 mb-4 text-lg md:text-xl">{errorMessage}</h3>
        )}
      </div>
    </section>
  );
}
