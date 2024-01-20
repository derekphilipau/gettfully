import { useEffect, useState } from 'react';
import type { AggOption } from '@/types';
import { Check } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface SearchProps {
  title: string;
  field: string;
  selectedResult?: string;
  onSelectResult: (option: string) => void;
}

export function ComboboxSearch({
  title,
  field,
  selectedResult,
  onSelectResult,
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectResult = (option: string) => {
    onSelectResult(option);

    // OPTIONAL: reset the search query upon selection
    // setSearchQuery('');
  };

  return (
    <Command
      shouldFilter={false}
      className="h-auto rounded-lg border border-b-0 shadow-md"
    >
      <CommandInput
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder={`Search ${title}`}
      />

      <SearchResults
        field={field}
        query={searchQuery}
        selectedResult={selectedResult}
        onSelectResult={handleSelectResult}
      />
    </Command>
  );
}

interface SearchResultsProps {
  field: string;
  query: string;
  selectedResult: SearchProps['selectedResult'];
  onSelectResult: SearchProps['onSelectResult'];
}

function SearchResults({
  field,
  query,
  selectedResult,
  onSelectResult,
}: SearchResultsProps) {
  const [data, setData] = useState<AggOption[]>([]);
  const [isError, setIsError] = useState(false);
  const [debouncedSearchQuery] = useDebounce(query, 500);
  const [isLoading, setIsLoading] = useState(false);
  const enabled = !!debouncedSearchQuery;

  useEffect(() => {
    function getStuff(field: string, query: string) {
      setIsLoading(true);
      fetch(`/api/search/options?field=${field}&query=${debouncedSearchQuery}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.data?.length > 0) {
            setData(data.data);
          } else {
            setData([]);
          }
          setIsLoading(false);
        });
    }
    if (enabled) {
      getStuff(field, query);
    }
  }, [enabled, query, field, debouncedSearchQuery]);

  if (!enabled) return null;

  return (
    <CommandList>
      {/* TODO: these should have proper loading aria */}
      {isLoading && <div className="p-4 text-sm">Searching...</div>}
      {!isError && !isLoading && !data?.length && (
        <div className="p-4 text-sm">No matches found</div>
      )}
      {isError && <div className="p-4 text-sm">Something went wrong</div>}

      {data?.map(({ key, doc_count }) => {
        return (
          <CommandItem
            key={key}
            onSelect={() => onSelectResult(key)}
            value={key}
            className="flex flex-wrap items-center justify-between"
          >
            <div className="flex max-w-xs items-center sm:max-w-none">
              <Check
                className={cn(
                  'mr-2 size-4',
                  selectedResult === key ? 'opacity-100' : 'opacity-0'
                )}
              />
              <div className="text-wrap">{key}</div>
            </div>
            <Badge variant="secondary">{doc_count}</Badge>
          </CommandItem>
        );
      })}
    </CommandList>
  );
}
