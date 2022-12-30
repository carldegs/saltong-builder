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

import HexAnswer from './types/HexAnswer';

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

export const getHexAnswers = (
  cleanWordList: Omit<HexAnswer, 'isPangram' | 'score'>[],
  rootWord: string,
  centerLetter: string
): HexAnswer[] =>
  cleanWordList
    .filter(
      ({ letters: cLetters }) =>
        cLetters.includes(centerLetter) &&
        cLetters.split('').every((letter) => rootWord.indexOf(letter) >= 0)
    )
    .map(({ word, letters }) => ({
      word,
      letters,
      isPangram: isPangram(word),
      score: getWordScore(word),
    }));

export const getNumPangrams = (
  validWords: HexAnswer[],
  selectedWords: string[]
) => {
  const filteredWords = validWords.filter(({ word }) =>
    selectedWords.includes(word)
  );

  let numPangrams = 0;
  filteredWords.forEach(({ isPangram }) => {
    if (isPangram) {
      numPangrams += 1;
    }
  });

  return numPangrams;
};

export const getMaxScore = (
  validWords: HexAnswer[],
  selectedWords: string[]
) => {
  const filteredWords = validWords.filter(({ word }) =>
    selectedWords.includes(word)
  );

  let maxScore = 0;
  filteredWords.forEach(({ score }) => {
    maxScore += score;
  });

  return maxScore;
};
