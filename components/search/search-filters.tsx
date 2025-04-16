'use client';

import { useRouter } from 'next/navigation';
import type { ApiSearchParams } from '@/types';

import { DebouncedInput } from '@/components/ui-custom/debounced-input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OptionsCombobox } from './options-combobox';
import { getUrlWithParam } from './search-params';

export function SearchFilters({ params }: { params: ApiSearchParams }) {
  const router = useRouter();

  function onRoleChange(value: string) {
    router.push(getUrlWithParam(params, 'role', value));
  }

  function onNationalityChange(value: string) {
    router.push(getUrlWithParam(params, 'nationality', value));
  }

  function onBirthPlaceChange(value: string) {
    router.push(getUrlWithParam(params, 'birthPlace', value));
  }

  function onDeathPlaceChange(value: string) {
    router.push(getUrlWithParam(params, 'deathPlace', value));
  }

  function onStartYearChange(value: string) {
    router.push(getUrlWithParam(params, 'startYear', value || undefined));
  }

  function onEndYearChange(value: string) {
    router.push(getUrlWithParam(params, 'endYear', value || undefined));
  }

  function onGenderChange(value: string) {
    router.push(getUrlWithParam(params, 'gender', value));
  }

  return (
    <div className="flex flex-wrap gap-2">
      <OptionsCombobox
        value={params.role}
        title="Role"
        field="roles.name"
        onChangeAction={onRoleChange}
      />
      <OptionsCombobox
        value={params.nationality}
        title="Nationality"
        field="nationalities.name"
        onChangeAction={onNationalityChange}
      />
      <OptionsCombobox
        value={params.birthPlace}
        title="Birthplace"
        field="biographies.birthPlaceName"
        onChangeAction={onBirthPlaceChange}
      />
      <OptionsCombobox
        value={params.deathPlace}
        title="Deathplace"
        field="biographies.deathPlaceName"
        onChangeAction={onDeathPlaceChange}
      />
      <div className="">
        <DebouncedInput
          id="startYear"
          placeholder="Born After"
          className="w-28"
          value={params.startYear}
          onChange={onStartYearChange}
        />
      </div>
      <div className="">
        <DebouncedInput
          id="endYear"
          placeholder="Died Before"
          className="w-28"
          value={params.endYear}
          onChange={onEndYearChange}
        />
      </div>
      <RadioGroup
        value={params.gender || ''}
        onValueChange={onGenderChange}
        className="flex h-10 flex-wrap items-center"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="" id="gender1" />
          <Label htmlFor="gender1">All Genders</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="M" id="gender2" />
          <Label htmlFor="gender2">Male</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="F" id="gender3" />
          <Label htmlFor="gender3">Female</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
