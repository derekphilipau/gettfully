'use client';

import * as React from 'react';
import { ChevronsUpDownIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ComboboxSearch } from './combobox-search';

const POPOVER_WIDTH = 'w-full sm:w-[220px]';

export function OptionsCombobox({
  value,
  title,
  field,
  onChange,
}: {
  value: string | undefined;
  title: string;
  field: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(
    value || undefined
  );

  const handleSetActive = React.useCallback(
    (value: string) => {
      setSelected(value);
      onChange(value);
      setOpen(false);
    },
    [onChange]
  );

  let displayName = title;
  if (selected) {
    displayName = selected;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('justify-between', POPOVER_WIDTH)}
        >
          <div className="overflow-hidden text-ellipsis">{displayName}</div>

          <div className="flex gap-x-1">
            {selected && (
              <XIcon
                className="ml-1 size-4 shrink-0"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(undefined);
                  onChange('');
                }}
              />
            )}
            <ChevronsUpDownIcon className="ml-1 size-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" className={cn('p-0', POPOVER_WIDTH)}>
        <ComboboxSearch
          title={title}
          field={field}
          selectedResult={selected}
          onSelectResult={handleSetActive}
        />
      </PopoverContent>
    </Popover>
  );
}
