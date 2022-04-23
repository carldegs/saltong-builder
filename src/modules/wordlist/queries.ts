import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

import ApiError from '../../lib/errors/ApiError';

interface WordListSearchQuery {
  search?: string;
  wordlen?: number | string;
}

export const getWordlist = async (query: WordListSearchQuery) => {
  try {
    const { data } = await axios.get<string[]>(
      `/api/wordlist?${Object.entries(query).map(
        ([key, value]) => `${key}=${value}`
      )}`
    );

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryWordlist = (
  searchQuery?: WordListSearchQuery,
  options?: UseQueryOptions<string[], ApiError>
) =>
  useQuery(
    ['wordlist', searchQuery],
    () => getWordlist(searchQuery || {}),
    options
  );

export default useQueryWordlist;
