import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import prisma from './lib/prisma.js';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// ! ユーザー一覧取得
app.get('/users', async (c) => {
  const users = await prisma.user.findMany();
  return c.json(users);
});

// ! ユーザー作成
app.post('/users', async (c) => {
  try {
    const body = await c.req.json();

    if (!body.name || !body.email || !body.password) {
      return c.json({ error: 'Name and email and password are required' }, 400);
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });
    return c.json(user, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// ! 特定のユーザー取得
app.get('/users/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error) {
    return c.json({ error: 'Failed to retrieve user' }, 500);
  }
});

// ! ユーザー更新
app.put('/users/:id', async (c) => {
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
});

// ! ユーザー削除
app.delete('/users/:id', async (c) => {
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

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
