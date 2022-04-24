import { NextApiRequest } from 'next';

import createApiHandler from '../../../lib/api/create-api-handler';
import db from '../../../lib/api/db';
import { HexGameData } from '../../../types/HexGameData';
import { getHexAnswers, getUniqueLetters } from '../../../utils';

interface HexComboAnswersRequest extends NextApiRequest {
  query: {
    centerLetter: string;
    rootWord: string;
  };
}

interface PostHexDataRequest extends NextApiRequest {
  body: HexGameData;
}

const HexComboAnswersHandler = createApiHandler()
  .get(async (req: HexComboAnswersRequest, res) => {
    const { centerLetter, rootWord } = req.query;
    await db.read();

    const { wordlist, hexBlacklist: blacklist } = db.data;

    const cleanWordList = Array.from(new Set(wordlist))
      .filter((word) => !blacklist.includes(word))
      .map((word) => ({ word, letters: getUniqueLetters(word) }));

    res.json(getHexAnswers(cleanWordList, rootWord, centerLetter));
  })
  .post(async (req: PostHexDataRequest, res) => {
    const { body } = req;
    await db.read();

    db.data.hexRound = {
      ...db.data.hexRound,
      [body.date]: body as HexGameData,
    };

    await db.write();

    res.json({ success: true });
  });

export default HexComboAnswersHandler;
