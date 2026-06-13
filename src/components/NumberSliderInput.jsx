import React from 'react';

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

  const classes = [
    'number-input',
    narrow && 'number-input--narrow',
    className,
  ].filter(Boolean).join(' ');

  return (
    <input
      type="number"
      className={`input-field ${classes}`}
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder}
      min={min}
    />
  );
};

export default NumberSliderInput;
