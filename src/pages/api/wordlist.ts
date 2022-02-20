import { NextApiRequest } from 'next';

import createApiHandler from '../../lib/api/create-api-handler';
import db from '../../lib/api/db';

interface WordlistRequest extends NextApiRequest {
  query: {
    search?: string;
    wordlen?: string;
  };
}

const WordlistHandler = createApiHandler().get(
  async (req: WordlistRequest, res) => {
    const { search, wordlen } = req.query || {};

    await db.read();

    const { wordlist } = db.data;

    let filteredList = [...wordlist];

    if (search) {
      const regex = new RegExp(
        `^${search.replace(/\*/g, '(.*)').replace(/\?/g, '.')}$`
      );

      filteredList = filteredList.filter((value) => regex.test(value));
    }

    if (wordlen) {
      const wordLength = Number(wordlen);

      if (isNaN(wordLength)) {
        throw new Error('wordlen not a number');
      }

      filteredList = filteredList.filter(
        (value) => value.length === wordLength
      );
    }

    filteredList = Array.from(new Set(filteredList));

    res.json(filteredList);
  }
);

export default WordlistHandler;
