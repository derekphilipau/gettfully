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
import { Search } from './search';

const POPOVER_WIDTH = 'w-full sm:w-[220px]';
const BUTTON_LABEL_MAX_LENGTH = 18;

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
      setOpen(false);
    },
    [onChange]
  );

  let displayName = title;
  if (selected) {
    displayName =
      selected.length > BUTTON_LABEL_MAX_LENGTH + 2
        ? `${selected.substring(0, BUTTON_LABEL_MAX_LENGTH)}...`
        : selected;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('justify-between', POPOVER_WIDTH)}
        >
          {displayName}

          <div className="flex gap-x-1">
            {selected && (
              <XIcon
                className="ml-1 h-4 w-4 shrink-0"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(undefined);
                  onChange('');
                }}
              />
            )}
            <ChevronsUpDownIcon className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </div>
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
