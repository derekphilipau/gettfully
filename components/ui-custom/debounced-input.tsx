'use client';

import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Input, type InputProps } from '@/components/ui/input';

interface DebouncedInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value: string | number | undefined;
  debounceTimeout?: number;
  onChange: (value: string) => void;
}

const DebouncedInput = React.forwardRef<HTMLInputElement, DebouncedInputProps>(
  ({ value: initialValue, onChange, debounceTimeout = 500, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState<string>(
      initialValue?.toString() ?? ''
    );

    const debouncedOnChange = useDebouncedCallback(onChange, debounceTimeout);

    React.useEffect(() => {
      const stringValue = initialValue?.toString() ?? '';
      if (stringValue !== inputValue) {
        setInputValue(stringValue);
        // Optionally cancel any pending debounced calls if the prop value changes directly
        // debouncedOnChange.cancel();
      }
    }, [initialValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      debouncedOnChange(newValue);
    };

    return (
      <Input
        ref={ref}
        {...props}
        value={inputValue}
        onChange={handleInputChange}
      />
    );
  }
);

DebouncedInput.displayName = 'DebouncedInput';

export { DebouncedInput };
