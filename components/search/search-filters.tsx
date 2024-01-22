'use client';

import { useRouter } from 'next/navigation';
import type { ApiSearchParams } from '@/types';

import { Input } from '@/components/ui/input';
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
    router.push(getUrlWithParam(params, 'startYear', value));
  }

  function onEndYearChange(value: string) {
    router.push(getUrlWithParam(params, 'endYear', value));
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
        onChange={onRoleChange}
      />
      <OptionsCombobox
        value={params.nationality}
        title="Nationality"
        field="nationalities.name"
        onChange={onNationalityChange}
      />
      <OptionsCombobox
        value={params.birthPlace}
        title="Birthplace"
        field="biographies.birthPlaceName"
        onChange={onBirthPlaceChange}
      />
      <OptionsCombobox
        value={params.deathPlace}
        title="Deathplace"
        field="biographies.deathPlaceName"
        onChange={onDeathPlaceChange}
      />
      <div className="">
        <Input
          id="startYear"
          placeholder="Born After"
          className="w-28"
          value={params.startYear}
          onChange={(e) => onStartYearChange(e.target.value)}
        />
      </div>
      <div className="">
        <Input
          id="endYear"
          placeholder="Died Before"
          className="w-28"
          value={params.endYear}
          onChange={(e) => onEndYearChange(e.target.value)}
        />
      </div>
      <RadioGroup
        defaultValue={params.gender || ''}
        onValueChange={onGenderChange}
        className="flex h-10 flex-wrap items-center"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="" id="r1" />
          <Label htmlFor="r1">All Genders</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="M" id="r2" />
          <Label htmlFor="r2">Male</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="F" id="r3" />
          <Label htmlFor="r3">Female</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
