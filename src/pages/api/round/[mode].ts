import { NextApiRequest } from 'next';

import createApiHandler from '../../../lib/api/create-api-handler';
import db from '../../../lib/api/db';
import GameData from '../../../types/GameData';
import GameMode from '../../../types/GameMode';
import { HexGameData } from '../../../types/HexGameData';

interface RoundDataRequest extends NextApiRequest {
  query: {
    mode: GameMode;
  };
}

interface PostRoundDataRequest extends RoundDataRequest {
  body: GameData | HexGameData;
}

const RoundHandler = createApiHandler()
  .get(async (req: RoundDataRequest, res) => {
    const { mode } = req.query || {};

    await db.read();

    const roundData = db.data[`${mode}Round`];

    res.json(roundData);
  })
  .post(async (req: PostRoundDataRequest, res) => {
    const { mode } = req.query || {};
    const data = req.body;

    await db.read();

    if (mode !== GameMode.hex && mode !== GameMode.kal) {
      const roundData = db.data[`${mode}Round`];
      if (!roundData[data.date]) {
        db.data[`${mode}Round`] = {
          ...db.data[`${mode}Round`],
          [data.date]: data as GameData,
        };

        await db.write();

        res.json({ success: true });
      }

      throw new Error(
        `Entry with date ${data.date} already exists. Call patch instead to update it.`
      );
    } else if (mode === GameMode.hex) {
      // TODO: add duplicate date check
      db.data.hexRound = {
        ...db.data.hexRound,
        [data.date]: data as HexGameData,
      };

      await db.write();

      res.json({ success: true });
    }
  });

export default RoundHandler;
