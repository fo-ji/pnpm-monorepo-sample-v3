import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import prisma from './lib/prisma.js';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono();

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const route = app
  .get('/', (c) => {
    return c.text('Hello Hono!');
  })
  // ! ユーザー一覧取得
  .get(
    '/users',
    zValidator(
      'query',
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
      })
    ),
    async (c) => {
      const { name, email } = c.req.valid('query');

      try {
        const users = await prisma.user.findMany({
          where: {
            name: {
              contains: name,
            },
            email: {
              contains: email,
            },
          },
        });

        return c.json({ users }, 200);
      } catch (error) {
        return c.json({ error: 'bad request' }, 400);
      }
    }
  )
  // ! 特定のユーザー取得
  .get(
    '/users/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid('param');

      try {
        const user = await prisma.user.findUnique({
          where: { id },
        });

        if (!user) {
          return c.json({ error: 'not found' }, 404);
        }

        return c.json({ user }, 200);
      } catch (error) {
        return c.json({ error: 'bad request' }, 400);
      }
    }
  )
  // ! ユーザー作成
  // .post('/users', async (c) => {
  //   try {
  //     const body = await c.req.json();

  //     if (!body.name || !body.email || !body.password) {
  //       return c.json(
  //         { error: 'Name and email and password are required' },
  //         400
  //       );
  //     }

  //     const user = await prisma.user.create({
  //       data: {
  //         name: body.name,
  //         email: body.email,
  //         password: body.password,
  //       },
  //     });
  //     return c.json(user, 201);
  //   } catch (error) {
  //     return c.json({ error: 'Failed to create user' }, 500);
  //   }
  // })
  .post(
    '/users',
    zValidator('json', createUserSchema, async ({ success, data }, c) => {
      if (!success) {
        return c.text('Invalid!', 400);
      }
      const user = await prisma.user.create({
        data,
      });
      return c.json(user, 201);
    })
    //...
  )
  // ! ユーザー更新
  .put('/users/:id', async (c) => {
    const id = c.req.param('id');

    try {
      const body = await c.req.json();

      if (!body.name && !body.email) {
        return c.json(
          { error: 'At least one field (name or email) is required' },
          400
        );
      }

      const user = await prisma.user.update({
        where: { id },
        data: body,
      });

      return c.json(user);
    } catch (error) {
      return c.json({ error: 'User not found or update failed' }, 404);
    }
  })

  // ! ユーザー削除
  .delete('/users/:id', async (c) => {
    const id = c.req.param('id');

    try {
      await prisma.user.delete({
        where: { id },
      });
      return c.json({ message: 'User deleted successfully' });
    } catch (error) {
      return c.json({ error: 'User not found or delete failed' }, 404);
    }
  });

export type AppType = typeof route;

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
