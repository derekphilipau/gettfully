'use client';

import { useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import type { ApiSearchParams } from '@/types';
import { CircleIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getUrlWithParam } from './search-params';

interface SearchFilterTagProps {
  params: ApiSearchParams;
  name: string;
  value: string | number;
}

export function SearchFilterTag({ params, name, value }: SearchFilterTagProps) {
  const router = useRouter();

  const dict = getDictionary();

  function removeFilter() {
    router.push(getUrlWithParam(params, name, undefined));
  }

  return (
    <Button
      onClick={() => removeFilter()}
      aria-label={dict['button.removeFilter']}
      variant="outline"
      size="sm"
    >
      {name === 'color' ? (
        <CircleIcon
          className={`size-6 rounded-full`}
          style={{ backgroundColor: `#${value}`, color: `#${value}` }}
        />
      ) : (
        <div>{value}</div>
      )}
      <XIcon className="ml-2 size-4" />
    </Button>
  );
}
