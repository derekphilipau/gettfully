/**
 * Gets the value of a boolean from a string or boolean, or return false.
 *
 * @param x the value to check
 * @returns  true if x is a boolean or a string that is 'true', false otherwise
 */
export function getBooleanValue(
  x?: boolean | string | string[] | number | null
) {
  if (typeof x === 'boolean') return x;
  if (typeof x === 'string') {
    return x.toLowerCase() === 'true' || x === '1';
  }
  if (typeof x === 'number') return x === 1;
  return false; // undefined, null, string[]
}
