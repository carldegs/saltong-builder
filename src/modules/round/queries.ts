import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

import ApiError from '../../lib/errors/ApiError';
import GameData from '../../types/GameData';
import GameMode from '../../types/GameMode';
import { HexGameData } from '../../types/HexGameData';

export const getRoundData = async (
  mode?: GameMode
): Promise<Record<string, GameData | HexGameData>> => {
  if (!mode) {
    return mode === GameMode.hex
      ? ({} as Record<string, HexGameData>)
      : ({} as Record<string, GameData>);
  }

  try {
    const { data } = await axios.get(`/api/round/${mode}`);

    return mode === GameMode.hex
      ? (data as Record<string, HexGameData>)
      : (data as Record<string, GameData>);
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryRoundData = (
  mode?: GameMode,
  options?: UseQueryOptions<Record<string, HexGameData | GameData>, ApiError>
) => useQuery(['roundData', mode], () => getRoundData(mode), options);

export default useQueryRoundData;
