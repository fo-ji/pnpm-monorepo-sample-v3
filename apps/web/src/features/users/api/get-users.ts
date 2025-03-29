import { client } from '@/lib/hono';
import type { GetUsersQuery } from '../types';

export const getUsers = async ({ query }: GetUsersQuery) => {
  const res = await client.users.$get({ query });

  if (res.ok) {
    return await res.json();
  }

  throw new Error(res.statusText);
};
