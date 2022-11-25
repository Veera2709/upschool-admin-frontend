export const has = (value, valueToFind) => (value & valueToFind) === valueToFind;

export const is = (value, valueToCompare) => value === valueToCompare;

export const add = (value, valueToAdd) => value | valueToAdd;

export const remove = (value, valueToRemove) => value & ~valueToRemove;