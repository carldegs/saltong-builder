import { HexData } from './HexData';

export interface CombinationData {
  rootWord: string;
  letters: string;
  results: HexData;
  minWords: number;
  maxWords: number;
  minMaxScore: number;
  maxMaxScore: number;
  minNumPangrams: number;
  maxNumPangrams: number;
}
