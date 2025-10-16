/**
 * Built-in standard library functions for Pluto
 */

export const builtins = {
  // Console actions
  print: (...args) => {
    console.log(...args);
    return args.length === 1 ? args[0] : args;
  },
  
  log: (...args) => {
    console.log(...args);
    return args.length === 1 ? args[0] : args;
  },
  
  // Math actions
  abs: (x) => Math.abs(x),
  sqrt: (x) => Math.sqrt(x),
  pow: (x, y) => Math.pow(x, y),
  min: (...args) => Math.min(...args),
  max: (...args) => Math.max(...args),
  random: () => Math.random(),
  floor: (x) => Math.floor(x),
  ceil: (x) => Math.ceil(x),
  round: (x) => Math.round(x),
  
  // String actions
  length: (str) => {
    if (Array.isArray(str)) return str.length;
    return String(str).length;
  },
  
  substring: (str, start, end) => String(str).substring(start, end),
  indexOf: (str, search) => String(str).indexOf(search),
  toUpperCase: (str) => String(str).toUpperCase(),
  toLowerCase: (str) => String(str).toLowerCase(),
  split: (str, separator) => String(str).split(separator),
  trim: (str) => String(str).trim(),
  replace: (str, search, replacement) => String(str).replace(search, replacement),
  
  // Array actions
  push: (arr, ...items) => {
    const copy = [...arr];
    copy.push(...items);
    return copy;
  },
  
  pop: (arr) => {
    const copy = [...arr];
    const item = copy.pop();
    return { array: copy, item };
  },
  
  slice: (arr, start, end) => arr.slice(start, end),
  
  map: (arr, fn) => arr.map(fn),
  filter: (arr, fn) => arr.filter(fn),
  reduce: (arr, fn, initial) => arr.reduce(fn, initial),
  
  join: (arr, separator = ',') => arr.join(separator),
  reverse: (arr) => [...arr].reverse(),
  sort: (arr) => [...arr].sort(),
  
  // Array utility functions
  sum: (arr) => arr.reduce((a, b) => a + b, 0),
  average: (arr) => arr.reduce((a, b) => a + b, 0) / arr.length,
  minimum: (arr) => Math.min(...arr),
  maximum: (arr) => Math.max(...arr),
  
  // Type conversion
  toString: (value) => String(value),
  toNumber: (value) => Number(value),
  toBoolean: (value) => Boolean(value),
  
  // Type checking
  isNumber: (value) => typeof value === 'number',
  isString: (value) => typeof value === 'string',
  isBoolean: (value) => typeof value === 'boolean',
  isArray: (value) => Array.isArray(value),
  isObject: (value) => typeof value === 'object' && value !== null && !Array.isArray(value),
};
