import { client } from '@/lib/hono';
import type { GetUserParam } from '../types';

export const getUser = async ({ param }: GetUserParam) => {
  const res = await client.users[':id'].$get({ param });

  if (res.ok) {
    return await res.json();
  }

  throw new Error(res.statusText);
};
