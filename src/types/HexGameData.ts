// Saved in json file
export interface HexGameData {
  rootWord: string;
  centerLetter: string;
  date: string;
  gameId: number;
  numPangrams: number;
  numWords: number;
  maxScore: number;
  words?: string[]; // Only fetched when viewing previous answers
}
