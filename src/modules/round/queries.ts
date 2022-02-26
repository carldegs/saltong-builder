import axios from 'axios';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';

import ApiError from '../../lib/errors/ApiError';
import GameData from '../../types/GameData';
import GameMode from '../../types/GameMode';
import { HexGameData } from '../../types/HexGameData';

export const getRoundData = async <T = HexGameData | GameData>(
  mode?: GameMode
): Promise<Record<string, T>> => {
  if (!mode) {
    return {} as Record<string, T>;
  }

  try {
    const { data } = await axios.get<Record<string, T>>(`/api/round/${mode}`);

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

export const addRoundData = async ({
  mode,
  roundData,
}: {
  mode: GameMode;
  roundData: HexGameData | GameData;
}) => {
  try {
    const { data } = await axios.post<{ success: boolean }>(
      `/api/round/${mode}`,
      roundData
    );
    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryRoundData = <T = HexGameData | GameData>(
  mode?: GameMode,
  options?: UseQueryOptions<Record<string, T>, ApiError>
) => useQuery(['roundData', mode], () => getRoundData<T>(mode), options);

export const useMutateRoundData = () => {
  const queryClient = useQueryClient();

  return useMutation(addRoundData, {
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['roundData', variables.mode],
        (prevData: (HexGameData | GameData)[]) => ({
          ...prevData,
          [variables.roundData.date]: variables.roundData,
        })
      );
    },
  });
};

export default useQueryRoundData;
