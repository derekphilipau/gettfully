'use client';

import { Key, useEffect, useState } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';

import { UlanSubjectCard } from '@/components/search/ulan-subject-card';
import { DebouncedInput } from '@/components/searchold/debounced-input';

type Props = {};

export function SearchContainer({}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dict = getDictionary();
  let errorMessage = dict['search.noResults'];

  function onSearch(q: string) {
    setSearchQuery(q);
  }

  useEffect(() => {
    const currentUrl = `/api/search?query=${searchQuery}`;
    fetch(currentUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data);
        setItems(data.data);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
        setError(error?.message);
        setItems([]);
      });
  }, [searchQuery]);

  return (
    <section className="container pt-2">
      <div>
        <DebouncedInput onSearchAsYouTypeChange={onSearch} />
      </div>
      <div className="mt-4 flex flex-col flex-wrap gap-2">
        {items?.length > 0 &&
          items.map(
            (item: any, i: Key) =>
              item && (
                <div className="rounded-lg border p-3 " key={i}>
                  <UlanSubjectCard ulanSubject={item} />
                </div>
              )
          )}
        {!(items?.length > 0) && (
          <h3 className="my-10 mb-4 text-lg md:text-xl">{errorMessage}</h3>
        )}
      </div>
    </section>
  );
}
