import GameMode from './GameMode';

type GameData = Record<
  Exclude<GameMode, GameMode.hex | GameMode.kal>,
  {
    word: string;
    gameId: number;
    date: string;
  }
>;

export default GameData;
