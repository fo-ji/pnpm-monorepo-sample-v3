import { client } from '@/lib/hono';
import type { InferResponseType, InferRequestType } from 'hono';

export type Users = InferResponseType<typeof client.users.$get>;
export type GetUsersQuery = InferRequestType<typeof client.users.$get>;
export type GetUserParam = InferRequestType<
  (typeof client.users)[':id']['$get']
>;
