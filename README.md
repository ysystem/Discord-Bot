# Discord-Bot

`client.on(イベント名, void関数)`  
と書くことで、イベントが起こったときにvoid関数に実装した機能が実行される。（[イベントの種類はこちら](https://discord.js.org/docs/packages/discord.js/14.18.0/Client:Class#on)）  
実装した機能を以下に示す。
以下、Voice ChannelをVCと記述する。

## VC入退出時の通知
### 機能概要
ユーザーがVCに入室あるいは退室したときに、テキストチャンネルにて  
`{ユーザー名}がVCに入室(退室)しました`  
と通知する機能。  
この機能はDiscord自体にデフォルトで実装されていない。  
この機能により、誰がVCにいるのかを把握しやすい。  
### 実装
`voiceStateUpdate`イベント
