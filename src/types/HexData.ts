export type HexData = Record<
  string,
  {
    // answers: {
    //   word: string;
    //   letters: string;
    //   isPangram: boolean;
    //   score: number;
    // }[];
    numWords: number;
    numPangrams: number;
    maxScore: number;
  }
>;
