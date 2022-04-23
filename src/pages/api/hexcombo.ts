import { differenceInSeconds } from 'date-fns';

import createApiHandler from '../../lib/api/create-api-handler';
import db from '../../lib/api/db';
import { CombinationData } from '../../types/CombinationData';
import { HexData } from '../../types/HexData';
import {
  getUniqueLetters,
  getWordScore,
  isPangram,
  isValidRootWord,
} from '../../utils';

const HexComboHandler = createApiHandler()
  .get(async (req, res) => {
    // TODO: Add pagination
    await db.read();

    const { hexCombo } = db.data;

    const filteredData = hexCombo
      .filter(({ minWords }) => minWords <= 100)
      .sort(({ minWords: ma }, { minWords: mb }) => ma - mb);

    res.json(filteredData);
  })
  .post(async (req, res) => {
    await db.read();

    const { wordlist, hexBlacklist: blacklist } = db.data;

    const cleanWordList = (wordlist || [])
      .filter((word) => !blacklist.includes(word))
      .map((word) => ({ word, letters: getUniqueLetters(word) }));

    const initRootWords = cleanWordList.filter(({ word }) =>
      isValidRootWord(word)
    );

    const rootWordList: typeof initRootWords = [
      ...initRootWords
        .reduce((map, obj) => map.set(obj.letters, obj), new Map())
        .values(),
    ];

    // eslint-disable-next-line no-console
    console.log('--- STARTING CREATING HEX LIST ---');

    const start = new Date();

    db.data.hexCombo = rootWordList.map(
      ({ word: rootWord, letters }, i): CombinationData => {
        if (!(i % 100)) {
          // eslint-disable-next-line no-console
          console.log(`${i} of ${rootWordList.length} done.`);
        }

        let results: HexData = {};
        letters.split('').forEach((centerLetter) => {
          const answers = cleanWordList
            .filter(
              ({ letters: cLetters }) =>
                cLetters.includes(centerLetter) &&
                cLetters
                  .split('')
                  .every((letter) => rootWord.indexOf(letter) >= 0)
            )
            .map(({ word, letters }) => ({
              word,
              letters,
              isPangram: isPangram(word),
              score: getWordScore(word),
            }));

          let maxScore = 0;

          answers.forEach(({ score }) => {
            maxScore += score;
          });

          results = {
            ...results,
            [centerLetter]: {
              // answers,
              numWords: answers.length,
              numPangrams: answers.filter(({ isPangram }) => isPangram).length,
              maxScore,
            },
          };
        });

        const values = Object.values(results);
        let numWordsList: number[] = [];
        let maxScoreList: number[] = [];
        let numPangramList: number[] = [];

        values.forEach(({ numWords, maxScore, numPangrams }) => {
          numWordsList = [...numWordsList, numWords];
          maxScoreList = [...maxScoreList, maxScore];
          numPangramList = [...numPangramList, numPangrams];
        });

        numWordsList.sort((a, b) => a - b);
        maxScoreList.sort((a, b) => a - b);
        numPangramList.sort((a, b) => a - b);

        return {
          rootWord,
          letters,
          results,
          minWords: numWordsList[0],
          maxWords: numWordsList[numWordsList.length - 1],
          minMaxScore: maxScoreList[0],
          maxMaxScore: maxScoreList[maxScoreList.length - 1],
          minNumPangrams: numPangramList[0],
          maxNumPangrams: numPangramList[numPangramList.length - 1],
        };
      }
    );

    const end = new Date();
    const runDuration = differenceInSeconds(start, end);

    // eslint-disable-next-line no-console
    console.log(
      `--- ${db.data.hexCombo.length} WORDS DONE IN ${Math.abs(
        runDuration
      )}s ---`
    );

    await db.write();

    res.json({ success: true });
  });

export default HexComboHandler;
