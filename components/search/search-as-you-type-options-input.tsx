'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { getDictionary } from '@/dictionaries/dictionaries';
import type { AggOption } from '@/types';

import { useDebounce } from '@/lib/debounce';
import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';

interface SearchAsYouTypeInputProps {
  name: string;
  field: string;
  onSearchAsYouTypeChange: (q: string) => void;
}

export function SearchAsYouTypeOptionsInput({
  name,
  field,
  onSearchAsYouTypeChange,
}: SearchAsYouTypeInputProps) {
  const dict = getDictionary();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [searchOptions, setSearchOptions] = useState<AggOption[]>([]);

  const debouncedSuggest = useDebounce(() => {
    if (value?.length < 3) {
      setSearchOptions([]);
      setOpen(false);
      return;
    }
    if (value)
      fetch(`/api/search/options?field=${field}&query=${value}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.data?.length > 0) {
            setSearchOptions(data.data);
            setOpen(true);
          } else {
            setSearchOptions([]);
            setOpen(false);
          }
        });
  }, 50);

  function selectValue(value: string) {
    onSearchAsYouTypeChange(value);
    setValue(value);
    setOpen(false);
  }

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debouncedSuggest();
  };

  function handleOnSubmit(event: FormEvent) {
    event.preventDefault();
    onSearchAsYouTypeChange(value);
    setOpen(false);
  }

  function handleOpenChange(event) {
    if (event) event.preventDefault();
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <form onSubmit={handleOnSubmit}>
          <Input
            type="search"
            name="query"
            placeholder={name}
            onChange={onQueryChange}
            value={value}
            autoComplete="off"
            onBlur={() => setOpen(false)}
          />
        </form>
      </PopoverAnchor>
      <PopoverContent
        className="p-0"
        onOpenAutoFocus={handleOpenChange}
        align="start"
      >
        <Command>
          <CommandGroup>
            {searchOptions.map((aggOption) => (
              <CommandItem
                key={aggOption.key}
                onSelect={() => {
                  selectValue(aggOption.key);
                }}
                className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <div className="flex w-full items-center justify-between ">
                  <div className="ml-2">{aggOption.key}</div>
                  <Badge variant="secondary">{aggOption.doc_count}</Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
