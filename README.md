# Discord-Bot
※注 ... 本botはdiscord.js v13を用いて実装しています。  
  
`client.on(イベント名, void関数)`  
と書くことで、イベントが起こったときにvoid関数に実装した機能が実行される。（[イベントの種類はこちら](https://discord.js.org/docs/packages/discord.js/14.18.0/Client:Class#on)）  
実装した機能を以下に示す。  
以下、Voice ChannelをVCと記述する。  
※Voice Channelとは ... Voice Channelに参加している間は、参加しているユーザーどうしで通話をすることができる。

## VC入退出時の通知
### 機能概要
ユーザーがVCに入室あるいは退室したときに、テキストチャンネルにて  
`{ユーザー名}がVCに入室(退室)しました`  
と通知する機能。  
この機能はDiscord自体にデフォルトで実装されていない。  
この機能により、誰がVCにいるのかを把握しやすい。  
### 実装(index.js 16~46行目)
`voiceStateUpdate`イベント発生時に本機能が実行される。  
引数は`(oldState, newState)`  (`voiceState`クラスは[こちら](https://discord.js.org/docs/packages/discord.js/14.18.0/VoiceState:Class))  
入室時は
- 入室前  
つまりVCに参加していない状態  
つまり`oldState.channelId === null`
- 入室後  
つまりVCに参加している状態  
つまり`newState.channelId !== null`
  
となるため、これらの条件を満たした場合、テキストチャンネルに通知が送られる(退室時も同様)。

## サーバーイベントが作成されたときの通知
### 機能概要
Discordにはサーバーイベント(ギルドイベント)機能が存在する。以下のようなもの  
![guildEvent](https://github.com/user-attachments/assets/6c9af536-b82b-496a-83e1-b538fe368331)  
こちらも同様、デフォルトではサーバーイベント作成時に通知してくれる機能は存在しない。
サーバーイベントが作成されると、以下のように通知される。  
![guildEventNotification](https://github.com/user-attachments/assets/6adae991-d926-42f7-8096-7f0627e6b9ee)
