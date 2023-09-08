import { createEffect } from 'effector';
import api from './axiosClient';

export const getReputationsFx = createEffect(async () => {
  const { data } = await api.get('reputations');

  return data;
});
