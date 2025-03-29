import type { AppType } from '../../../api';
import { hc } from 'hono/client';

export const client = hc<AppType>('http://host.docker.internal:3001/');
