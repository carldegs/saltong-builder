import { useCallback, useEffect, useMemo, useState } from 'react';

import useQueryHexCombo, {
  useQueryHexAnswers,
} from '../modules/hexcombo/queries';
import useQueryRoundData, {
  useMutateRoundData,
} from '../modules/round/queries';
import { HexSelectionState } from '../pages/hex/index';
import { CombinationData } from '../types/CombinationData';
import GameMode from '../types/GameMode';
import { HexGameData } from '../types/HexGameData';
import {
  getDateString,
  getMaxScore,
  getNextHexRound,
  getNumPangrams,
} from '../utils';

export const useHexSelection = () => {
  const [combo, setSelectedCombo] = useState<CombinationData | undefined>(
    undefined
  );
  const [centerLetter, setSelectedCenterLetter] = useState('');
  const [newGameId, setNewGameId] = useState(0);
  const { data: roundData, isLoading: isLoadingRoundData } =
    useQueryRoundData<HexGameData>(GameMode.hex);
  const [newDate, setNewDate] = useState(getDateString());
  const [selectionState, setSelectionState] = useState<HexSelectionState>(
    HexSelectionState.init
  );

  const addMutation = useMutateRoundData();
  const { data: hexCombo, isLoading: isFetchingHexCombo } = useQueryHexCombo();
  const { data: answerList } = useQueryHexAnswers(
    combo?.rootWord,
    centerLetter
  );

  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const isLoading = useMemo(
    () => isLoadingRoundData || isFetchingHexCombo,
    [isFetchingHexCombo, isLoadingRoundData]
  );

  const onSelectCombo = useCallback((_combo: CombinationData) => {
    setSelectedCombo(_combo);
    setSelectionState(HexSelectionState.centerLetterSelect);
  }, []);

  const onSelectCenterLetter = useCallback((_centerLetter: string) => {
    setSelectedCenterLetter(_centerLetter);
    setSelectionState(HexSelectionState.answersSelect);
  }, []);

  const onUpdate = useCallback((word: string) => {
    setSelectedWords((selected) => {
      if (selected.includes(word)) {
        return selected.filter((sw) => sw !== word);
      }

      return [...selected, word];
    });
  }, []);

  const onSubmit = useCallback(() => {
    addMutation.mutate({
      mode: GameMode.hex,
      roundData: {
        rootWord: combo?.rootWord,
        centerLetter,
        date: newDate,
        gameId: newGameId,
        numPangrams: getNumPangrams(answerList, selectedWords),
        numWords: selectedWords.length,
        maxScore: getMaxScore(answerList, selectedWords),
        words: selectedWords,
      } as HexGameData,
    });
    setSelectionState(HexSelectionState.init);
  }, [
    addMutation,
    answerList,
    centerLetter,
    combo?.rootWord,
    newDate,
    newGameId,
    selectedWords,
  ]);

  const onBack = useCallback(() => {
    switch (selectionState) {
      case HexSelectionState.answersSelect:
        setSelectionState(HexSelectionState.centerLetterSelect);
        return;
      case HexSelectionState.centerLetterSelect:
        setSelectionState(HexSelectionState.init);
        return;
    }
  }, [selectionState]);

  useEffect(() => {
    if (answerList?.length) {
      setSelectedWords(answerList.map(({ word }) => word));
    }
  }, [answerList]);

  useEffect(() => {
    const initData = Object.values(roundData || {});
    if (initData.length > 0) {
      const lastRound = initData[initData.length - 1];

      setNewDate(getDateString(getNextHexRound(lastRound.date)));
      setNewGameId(lastRound.gameId + 1);
    }
  }, [roundData]);

  return {
    combo,
    centerLetter,
    selectionState,
    answerList,
    selectedWords,
    roundData,
    newGameId,
    newDate,
    hexCombo,
    isLoading,
    onSelectCombo,
    onSelectCenterLetter,
    onBack,
    onUpdate,
    onSubmit,
  };
};
