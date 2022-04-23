import { NextApiRequest } from 'next';

import createApiHandler from '../../lib/api/create-api-handler';
import db from '../../lib/api/db';

interface PostBlacklistRequest extends NextApiRequest {
  body: {
    word: string;
  };
}

const BlacklistHandler = createApiHandler()
  .get(async (req, res) => {
    await db.read();

    const { hexBlacklist } = db.data;

    res.json(hexBlacklist);
  })
  .post(async (req: PostBlacklistRequest, res) => {
    const { word } = req.body;

    await db.read();

    const { hexBlacklist } = db.data;

    if (!hexBlacklist.includes(word)) {
      db.data.hexBlacklist = [...db.data.hexBlacklist, word];

      await db.write();

      res.json({ success: true });
    }

    throw new Error(`Word ${word} is already on the hex blacklist.`);
  });

export default BlacklistHandler;
