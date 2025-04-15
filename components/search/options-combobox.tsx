'use client';

import * as React from 'react';
import type { AggOption } from '@/types'; // Import AggOption type

import { AsyncSelect } from '@/components/ui-custom/async-select';
import { Badge } from '@/components/ui/badge';

const POPOVER_WIDTH = 'w-full sm:w-[220px]';

async function fetchOptions(
  field: string,
  query?: string
): Promise<AggOption[]> {
  const res = await fetch(
    `/api/search/options?field=${field}${query ? `&query=${query}` : ''}`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch options');
  }
  const data = await res.json();
  return data?.data || [];
}

const getOptionValueAction = (option: AggOption) => option.key;
const getDisplayValueAction = (option: AggOption) => option.key;
const renderOptionAction = (option: AggOption) => (
  <div className="flex w-full items-center justify-between">
    <span className="text-wrap">{option.key}</span>
    <Badge variant="secondary">{option.doc_count}</Badge>
  </div>
);

export function OptionsCombobox({
  value,
  title,
  field,
  onChangeAction,
}: {
  value: string | undefined;
  title: string;
  field: string;
  onChangeAction: (value: string) => void;
}) {
  const boundFetcher = React.useCallback(
    (query?: string) => fetchOptions(field, query),
    [field]
  );

  return (
    <AsyncSelect<AggOption>
      fetcherAction={boundFetcher}
      getOptionValueAction={getOptionValueAction}
      getDisplayValueAction={getDisplayValueAction}
      renderOptionAction={renderOptionAction}
      value={value || ''}
      onChangeAction={onChangeAction}
      label={title}
      placeholder={title}
      clearable={true}
      triggerClassName={POPOVER_WIDTH}
      width={POPOVER_WIDTH.replace('w-', '')}
      noResultsMessage={`No ${title.toLowerCase()} found.`}
      preload={false}
    />
  );
}
