'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';
import { Loader2Icon } from 'lucide-react';

import { useDebounce } from '@/lib/debounce';
import { Input } from '@/components/ui/input';

interface DebouncedInputProps {
  onSearchAsYouTypeChange: (searchQuery: string) => void;
  debounceTime?: number;
  value?: string;
}

export function DebouncedInput({
  onSearchAsYouTypeChange,
  debounceTime = 500,
  value = '',
}: DebouncedInputProps) {
  const dict = getDictionary();
  const [myValue, setMyValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSuggest = useDebounce(() => {
    setIsLoading(true);
    onSearchAsYouTypeChange(myValue);
  }, debounceTime);

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMyValue(e.target.value);
    debouncedSuggest();
  };

  /* TODO: This is very problematic.. difficult when debouncing while typing. */
  useEffect(() => {
    setMyValue(value);
    setIsLoading(false);
  }, [value]);

  return (
    <div className="relative flex grow items-stretch focus-within:z-10">
      <Input
        type="search"
        name="query"
        placeholder={dict['search.search']}
        onChange={onQueryChange}
        value={myValue}
        autoComplete="off"
        className="rounded-md text-lg"
      />
      {isLoading && (
        <div className="pointer-events-none absolute inset-y-0  right-0 flex items-center pr-9">
          <Loader2Icon
            className="size-6 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
