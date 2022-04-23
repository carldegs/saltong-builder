import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import ApiError from '../../lib/errors/ApiError';

export const getBlacklist = async () => {
  try {
    const { data } = await axios.get<string[]>('/api/blacklist');

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

export const blacklistWord = async (word: string) => {
  try {
    const { data } = await axios.post<{ success: boolean }>('/api/blacklist', {
      word,
    });
    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryBlacklist = () => useQuery(['blacklist'], () => getBlacklist());

export const useMutateBlacklist = () => {
  const queryClient = useQueryClient();

  return useMutation(blacklistWord, {
    onSuccess: (data, blacklistedWord) => {
      queryClient.setQueryData(['blacklist'], (prevData: string[]) => ({
        ...prevData,
        blacklistedWord,
      }));
    },
  });
};

export default useQueryBlacklist;
