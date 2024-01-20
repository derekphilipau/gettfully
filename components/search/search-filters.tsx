'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OptionsCombobox } from './options-combobox';

export function SearchFilters({
  onNationalityChange,
  onBirthPlaceChange,
  onDeathPlaceChange,
  onStartYearChange,
  onEndYearChange,
  onGenderChange,
  startYear,
  endYear,
  gender,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <OptionsCombobox
        title="Nationality"
        field="nationalities.name"
        onChange={onNationalityChange}
      />
      <OptionsCombobox
        title="Birthplace"
        field="biographies.birthPlaceName"
        onChange={onBirthPlaceChange}
      />
      <OptionsCombobox
        title="Deathplace"
        field="biographies.deathPlaceName"
        onChange={onDeathPlaceChange}
      />
      <div className="">
        <Input
          id="startYear"
          placeholder="Born After"
          className="w-28"
          value={startYear}
          onChange={(e) => onStartYearChange(e.target.value)}
        />
      </div>
      <div className="">
        <Input
          id="endYear"
          placeholder="Died Before"
          className="w-28"
          value={endYear}
          onChange={(e) => onEndYearChange(e.target.value)}
        />
      </div>
      <RadioGroup
        defaultValue={gender}
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
