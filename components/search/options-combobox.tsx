'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search } from './search';

const POPOVER_WIDTH = 'w-[200px]';

export function OptionsCombobox({
  title,
  field,
  onChange,
}: {
  title: string;
  field: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>();

  const handleSetActive = React.useCallback(
    (value: string) => {
      setSelected(value);
      onChange(value);
      // OPTIONAL: close the combobox upon selection
      setOpen(false);
    },
    [onChange]
  );

  const displayName = selected ? selected : title;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('justify-between', POPOVER_WIDTH)}
        >
          {displayName}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" className={cn('p-0', POPOVER_WIDTH)}>
        <Search
          field={field}
          selectedResult={selected}
          onSelectResult={handleSetActive}
        />
      </PopoverContent>
    </Popover>
  );
}
