# PNPM Workspace Guide

このリポジトリでは、```pnpm workspace```機能を利用して、複数のパッケージ（```web```, ```api```など）を管理しています。

## よく利用する pnpm コマンド

### ワークスペース全体にライブラリを追加する
```zsh
pnpm add xxxxx
```

### ルートの package.json にライブラリを追加する（devDependencies）
```zsh
pnpm add -D xxxxx
```

### `web` にライブラリを追加する
```zsh
pnpm web add xxxxx
```

### `api` にライブラリを追加する
```zsh
pnpm api add xxxxx
```

### `web` からライブラリを削除する
```zsh
pnpm web remove xxxxx
```

### `api` からライブラリを削除する
```zsh
pnpm api remove xxxxx
```

### すべてのパッケージの依存関係をインストールする
```zsh
pnpm install
```

### `web` のみ依存関係をインストールする
```zsh
pnpm web install
```

### `api` のみ依存関係をインストールする
```zsh
pnpm api install
```

### ルートのパッケージのみインストールする
```zsh
pnpm install --workspace-root
```

### `web` を起動する
```zsh
pnpm web dev
```

### `api` を起動する
```zsh
pnpm api dev
```

### ワークスペース内のすべてのパッケージから `xxxx` と `@types/yyyy` を削除する（-r オプション）
```zsh
pnpm remove xxxx @types/yyyy -r
```

---

その他の詳細な使い方については [pnpm の公式ドキュメント](https://pnpm.io/workspaces) を参照してください。
