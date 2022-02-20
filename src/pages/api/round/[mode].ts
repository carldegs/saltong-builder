import { NextApiRequest } from 'next';

import createApiHandler from '../../../lib/api/create-api-handler';
import db from '../../../lib/api/db';
import GameMode from '../../../types/GameMode';

interface RoundDataRequest extends NextApiRequest {
  query: {
    mode: GameMode;
  };
}

const RoundHandler = createApiHandler().get(
  async (req: RoundDataRequest, res) => {
    const { mode } = req.query || {};

    await db.read();

    const roundData = db.data[`${mode}Round`];

    res.json(roundData);
  }
);

export default RoundHandler;
