import {
  addDays,
  closestTo,
  format,
  isFriday,
  isTuesday,
  min,
  nextFriday,
  nextTuesday,
  previousFriday,
  previousTuesday,
} from 'date-fns';

export const getDateString = (date: Date | string = new Date()) =>
  format(new Date(date), 'yyyy-MM-dd');

export const getNextHexRound = (date) => {
  const nextDay = addDays(new Date(date), 1);
  return format(min([nextTuesday(nextDay), nextFriday(nextDay)]), 'yyyy-MM-dd');
};

export const getCurrHexRound = (date: string | Date = new Date()) => {
  date = new Date(date);

  if (isTuesday(date) || isFriday(date)) {
    return date;
  }

  return closestTo(date, [previousTuesday(date), previousFriday(date)]);
};

export const isValidRootWord = (word: string) =>
  Array.from(new Set(word)).length === 7;

export const getUniqueLetters = (word: string) =>
  Array.from(new Set(word)).sort().join('');

export const isPangram = (word) => Array.from(new Set(word)).length === 7;

export const getWordScore = (word) =>
  (word.length === 4 ? 1 : word.length) + (isPangram(word) ? 7 : 0);

export const showRange = (min: number, max: number) =>
  min === max ? `${min}` : `${min}-${max}`;
