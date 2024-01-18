'use client';

import { ChangeEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import { Loader2Icon } from 'lucide-react';

import { useDebounce } from '@/lib/debounce';
import { Input } from '@/components/ui/input';

interface DebouncedInputProps {
  onSearchAsYouTypeChange: (searchQuery: string) => void;
  debounceTime?: number;
  isLoading?: boolean;
}

export function DebouncedInput({
  onSearchAsYouTypeChange,
  debounceTime = 200,
  isLoading = false,
}: DebouncedInputProps) {
  const dict = getDictionary();
  const [value, setValue] = useState('');

  const debouncedSuggest = useDebounce(() => {
    onSearchAsYouTypeChange(value);
  }, debounceTime);

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debouncedSuggest();
  };

  return (
    <form>
      <div className="flex rounded-md shadow-sm">
        <div className="relative flex grow items-stretch focus-within:z-10">
          <Input
            type="search"
            name="query"
            placeholder={dict['search.search']}
            onChange={onQueryChange}
            value={value}
            autoComplete="off"
            className="h-12 px-3 py-2 text-xl"
          />
          {isLoading && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-10">
              <Loader2Icon
                className="h-6 w-6 animate-spin text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
