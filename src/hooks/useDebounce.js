import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce values (e.g. search inputs) by a set delay duration
 * @param {*} value - The input value to debounce
 * @param {number} delay - Delay timeout in milliseconds (default: 500ms)
 * @returns {*} debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout on value changes or unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
