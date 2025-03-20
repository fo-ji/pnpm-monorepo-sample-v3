# Getting Started
## STEP: 1
### workspace関連ファイルの配置
- プロジェクトルートに```pnpm-workspace.yaml```を作成
#### ./pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
```
- プロジェクトルートに```package.json```を作成
#### ./package.json
```json
{
  "name": "pnpm-monorepo-sample-v3",
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "api": "pnpm -F \"api\"",
    "web": "pnpm -F \"web\""
  },
  "engines": {
    "pnpm": "8.15.3",
    "npm": "please_use_pnpm_instead",
    "yarn": "please_use_pnpm_instead"
  },
  "packageManager": "pnpm@8.15.3",
}

```
- モノレポ構成のディレクトリを作成
```zsh
mkdir -p apps/web apps/api
```

### dockerファイルの配置
#### ./.dockerignore
- プロジェクトルートに```.dockerignore```を作成
```
node_modules
**/node_modules

```
- プロジェクトルートに```compose.yaml```を作成
#### ./compose.yaml
```yaml
x-common: &common
  env_file:
    # - .env
    - .env.local

services:
  web:
    <<: *common
    container_name: web
    build:
      dockerfile: web.Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - api
    volumes:
      - .:/app
  api:
    <<: *common
    container_name: api
    build:
      dockerfile: api.Dockerfile
    ports:
      - "3001:3001"
    depends_on:
      - db
    volumes:
      - .:/app

  db:
    <<: *common
    container_name: db
    image: postgres:16
    restart: always
    ports:
      - "5432:5432"
    volumes:
      - ./db/app/postgres/init.d:/docker-entrypoint-initdb.d
      - ./db/app/postgres/pgdata:/var/lib/postgresql/data
```

- ```api```と```web```のDockerfileを作成
#### ./api.Dockerfile
```Dockerfile
FROM node:22.14.0-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
COPY . .

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
# COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@8.15.3 --activate
RUN pnpm --version
# RUN pnpm install --frozen-lockfile
# CMD pnpm api dev
```
> [!WARNING]
> 初回ビルド時は一部コメントアウトして実行

#### ./web.Dockerfile
```Dockerfile
FROM node:22.14.0-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
COPY . .

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
# COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@8.15.3 --activate
RUN pnpm --version
# RUN pnpm install --frozen-lockfile
# CMD pnpm web dev
```
> [!WARNING]
> 初回ビルド時は一部コメントアウトして実行

```sh
$ docker compose build
```

## STEP: 2
### ```api```の設定
```sh
$ docker compose run --rm api pnpm create hono .
```
https://hono.dev/docs/getting-started/nodejs

- ポート3000は```web```側で利用するので、3001に変更する
#### ./apps/api/src/index.ts
```ts
import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
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

```

## STEP: 3
### ```web```の設定
```sh
$ docker compose run --rm web pnpm create-next-app@latest
```

## STEP: 4
### 共通の設定
- ```eslint```, ```@types/node```を一度プロジェクト全体から削除
```zsh
docker compose up
docker exec -it web sh
pnpm remove eslint @types/node -r
```
- ルートに```eslint```, ```@types/node```, ```prettier```を追加
```zsh
pnpm add eslint -D --workspace-root
pnpm add @types/node -D --workspace-root
pnpm add prettier -D --workspace-root
```