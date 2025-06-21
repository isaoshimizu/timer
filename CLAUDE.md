# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

バニラHTML、CSS、JavaScriptで構築された日本語タイマーWebアプリケーション（`タイマーWebアプリ`）です。ユーザーがカウントダウンタイマーを設定・制御できる静的Webアプリです。

## 開発コマンド

アプリケーションを実行するには：
```bash
# ブラウザでアプリケーションを開く
open src/index.html
# または開発時により良い体験のためローカルサーバーから配信
python -m http.server 8000
# その後 http://localhost:8000/src/ にアクセス
```

## アーキテクチャ

シングルオブジェクトアーキテクチャパターンを使用：

- **timerAppオブジェクト** (`src/js/timer.js:1`): 全てのタイマーロジックを含むメインアプリケーションコントローラー
  - 状態管理: `timer`, `totalTime`, `remainingTime`, `isRunning`, `timeLeft`
  - 開始/停止/リセットボタンと入力フィールドのイベント処理
  - デフォルト時間のクエリパラメータサポート (`?seconds=N`)
  - タイマー動作中のページタイトル更新
  - タイマーが0になった際のアラーム音再生

- **UI構造** (`src/index.html`):
  - 編集可能な時間入力 (時:分:秒 形式)
  - 開始/停止トグルボタン (テキストと色が変化)
  - リセットボタン
  - アラーム音用のaudio要素

- **スタイリング** (`src/css/styles.css`):
  - カードスタイルコンテナによる中央配置レイアウト
  - 大きく太字のタイマー表示 (48pxフォント)
  - 緑/赤のボタンカラースキーム
  - フォーカス状態付きレスポンシブ入力スタイリング

## 主要機能

- 編集可能なタイマー入力 (実行中でない時にクリックで編集)
- クエリパラメータによる初期化 (`?seconds=60`)
- 残り時間を表示するページタイトル更新
- タイマー完了時のオーディオアラーム
- ボタン状態管理 (時間が0の時は無効化)
- 一時停止/再開機能

## ファイル構造

```
src/
├── index.html          # メインHTMLファイル
├── css/styles.css      # アプリケーションスタイル
├── js/timer.js         # タイマーロジックと状態管理
├── audio/alarm.mp3     # アラーム音ファイル
└── favicon.ico         # サイトアイコン
```