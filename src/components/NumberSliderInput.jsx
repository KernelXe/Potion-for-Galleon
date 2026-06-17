import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const parseNumber = (value, fallback = 0) => {
  if (value === '' || value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

const NumberSliderInput = ({
  value,
  onChange,
  min = 0,
  placeholder = '',
  narrow = false,
  className = '',
}) => {
  const handleInputChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange('');
      return;
    }
    const num = Number(raw);
    if (!Number.isNaN(num) && num >= min) {
      onChange(raw);
    }
  };

  return (
    <Input
      type="number"
      className={cn('number-input', narrow && 'w-24', className)}
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder}
      min={min}
    />
  );
};

export default NumberSliderInput;
