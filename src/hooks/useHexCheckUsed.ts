import useQueryRoundData from '../modules/round/queries';
import GameMode from '../types/GameMode';
import { HexGameData } from '../types/HexGameData';
import { getUniqueLetters } from '../utils';

const useHexCheckUsed = (rootWord?: string): string[] => {
  const { data: roundData, isLoading: isLoadingRoundData } =
    useQueryRoundData<HexGameData>(GameMode.hex);

  if (!rootWord || isLoadingRoundData) {
    return [];
  }

  const letters = getUniqueLetters(rootWord);

  return Object.values(roundData)
    .filter(({ rootWord: currWord }) => {
      const currLetters = getUniqueLetters(currWord);

      return currLetters === letters;
    })
    .map(({ centerLetter }) => centerLetter);
};

export default useHexCheckUsed;
