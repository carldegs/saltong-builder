import { format } from 'date-fns';

export const getDateString = (date: Date | string = new Date()) =>
  format(new Date(date), 'yyyy-MM-dd');
