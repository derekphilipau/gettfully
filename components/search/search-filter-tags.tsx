import type { ApiSearchParams } from '@/types';

import { SearchFilterTag } from './search-filter-tag';

interface SearchFilterTagsProps {
  params: ApiSearchParams;
}

export function SearchFilterTags({ params }: SearchFilterTagsProps) {
  return (
    <>
      {params.role && (
        <SearchFilterTag params={params} name="role" value={params.role} />
      )}
      {params.nationality && (
        <SearchFilterTag
          params={params}
          name="nationality"
          value={params.nationality}
        />
      )}
      {params.birthPlace && (
        <SearchFilterTag
          params={params}
          name="birthPlace"
          value={params.birthPlace}
        />
      )}
      {params.deathPlace && (
        <SearchFilterTag
          params={params}
          name="deathPlace"
          value={params.deathPlace}
        />
      )}
      {params.startYear && (
        <SearchFilterTag
          params={params}
          name="startYear"
          value={params.startYear}
        />
      )}
      {params.endYear && (
        <SearchFilterTag
          params={params}
          name="endYear"
          value={params.endYear}
        />
      )}
      {params.gender && (
        <SearchFilterTag
          params={params}
          name="gender"
          value={params.gender === 'M' ? 'Male' : 'Female'}
        />
      )}
    </>
  );
}
