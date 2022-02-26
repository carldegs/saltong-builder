import { JSONFile, Low } from 'lowdb';

import GameData from '../../types/GameData';
import GameMode from '../../types/GameMode';
import { HexGameData } from '../../types/HexGameData';

interface Data
  extends Record<
    `${Exclude<GameMode, GameMode.hex | GameMode.kal>}Round`,
    Record<string, GameData>
  > {
  hex: HexGameData;
  wordlist: string[];
}

const adapter = new JSONFile<Data>('public/data/db.json');
const db = new Low(adapter);

export default db;
