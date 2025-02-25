# Discord-Bot

`client.on(イベント名, (引数) => void関数)`  
と書くことで、イベントが起こったときにvoid関数に実装した機能が実行される。（[イベントの種類はこちら](https://discord.js.org/docs/packages/discord.js/14.18.0/Client:Class#on)）  
実装した機能を以下に示す。
以下、Voice ChannelをVCと記述する。

## VC入退出時の通知
