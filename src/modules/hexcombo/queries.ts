import axios from 'axios';
import { useQuery, useMutation } from 'react-query';

import ApiError from '../../lib/errors/ApiError';
import { CombinationData } from '../../types/CombinationData';

export const getHexComboList = async () => {
  try {
    const { data } = await axios.get<CombinationData[]>('/api/hexcombo');

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

export const generateHexComboList = async () => {
  try {
    const { data } = await axios.post<{ success: boolean }>('/api/hexcombo');

    return data;
  } catch (err) {
    const { status, data } = err?.response || {};
    const { message, payload } = data || {};
    throw new ApiError(status, message, payload);
  }
};

const useQueryHexCombo = () => useQuery(['hexCombo'], () => getHexComboList());

export const useMutateHexCombo = () => useMutation(generateHexComboList);

export default useQueryHexCombo;
