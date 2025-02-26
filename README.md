# Discord-Bot
※注 ... 本botはdiscord.js v13を用いて実装しています。  
※環境構築方法やアクセストークンの設定方法などは記載していません。
  
`client.on(イベント名, void関数)`  
と書くことで、イベントが起こったときに、void関数に実装した機能が実行される。（[イベントの種類はこちら](https://discord.js.org/docs/packages/discord.js/14.18.0/Client:Class#on)）  
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
Discordにはサーバーイベント(ギルドイベント)機能が存在する。以下のようなもの。  
![guildEvent](https://github.com/user-attachments/assets/6c9af536-b82b-496a-83e1-b538fe368331)  
  
こちらも同様、デフォルトではサーバーイベント作成時に通知してくれる機能は存在しない。
サーバーイベントが作成されると、以下のように通知される。  
![guildEventNotification](https://github.com/user-attachments/assets/6adae991-d926-42f7-8096-7f0627e6b9ee)
  
### 実装(index.js 49~62行目)
`guildScheduledEventCreated`イベント発生時に本機能が実行される。  
引数は`(guildScheduledEvent)`(`guildScheduledEvent`クラスの詳細は[こちら](https://discord.js.org/docs/packages/discord.js/14.18.0/GuildScheduledEvent:Class))  
  
```const guild = guildScheduledEvent.guild;```
によりイベントが作成されたサーバーを取得。  
(英語圏ではDiscordサーバーのことをguild(ギルド)と呼んでいるらしい)  
  
```guild.channles.fetch()```
によりサーバーのチャンネル一覧を取得。  
  
`.then()`で各チャンネルに対する機能を実装することができる。  
本機能では、該当サーバーにおけるテキストチャンネルを一つ選択し、そのチャンネルに通知を送る。  
なお、テキストチャンネルのタイプ(`channel.type`)は`0`である。(チャンネルタイプの詳細は[こちら](https://discord-api-types.dev/api/discord-api-types-v10/enum/ChannelType))

## イベント開始時&終了時の通知

## アクティビティ開始の通知

## イベント予告通知
