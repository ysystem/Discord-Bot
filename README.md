# 自作DiscordBot
※注 ... 本botはdiscord.js v13を用いて実装しています。  
※環境構築方法やアクセストークンの設定方法などは記載していません。
  
`client.on(event, (引数) => void関数)`  
と書くことで、eventが起こったときに、void関数に実装した機能が実行される。（[イベントの種類はこちら](https://discord.js.org/docs/packages/discord.js/14.18.0/Client:Class#on)）  
実装した機能を以下に示す。  
以下、Voice ChannelをVCと記述する。  
※Voice Channelとは ... Voice Channelに参加している間は、参加しているユーザーどうしで通話をすることができる。

  
## VC入退室時の通知
### 機能概要
ユーザーがVCに入室あるいは退室したときに、テキストチャンネルにて  
`{ユーザー名}がVCに入室(退室)しました`  
と通知する機能。  
この機能はDiscord自体にデフォルトで実装されていない。  
この機能により、誰がVCにいるのかを把握しやすい。  
### 実装(index.js 16~46行目)
`voiceStateUpdate`event 発生時に本機能が実行される。  
引数は`(oldState, newState)`  (`voiceState`クラスの詳細は[こちら](https://discord.js.org/docs/packages/discord.js/14.18.0/VoiceState:Class))  
入室時は
- 入室前：  
つまりVCに参加していない状態：  
つまり`oldState.channelId === null`
- 入室後：  
つまりVCに参加している状態：  
つまり`newState.channelId !== null`
  
となるため、これらの条件を満たした場合、テキストチャンネルに通知が送られる(退室時も同様)。

  
## サーバーイベントが作成されたときの通知
### 機能概要
Discordにはサーバーイベント(ギルドイベント)機能が存在する。以下のようなもの。  
![guildEvent](https://github.com/user-attachments/assets/6c9af536-b82b-496a-83e1-b538fe368331)  
  
こちらも同様、デフォルトではサーバーイベント作成時に通知してくれる機能は存在しない。
本機能では、サーバーイベントが作成されると、以下のように通知される。  
![guildEventNotification](https://github.com/user-attachments/assets/6adae991-d926-42f7-8096-7f0627e6b9ee)
  
### 実装(index.js 49~62行目)
`guildScheduledEventCreated`event 発生時に本機能が実行される。  
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
### 機能概要
サーバーイベントが開始or終了したときに、その旨を通知する機能。  
以下のように表示される。
![eventStart](https://github.com/user-attachments/assets/bd82ef3c-6af0-4da1-8cd7-75372e5d4ce4)  
  
### 実装(index.js 64~88行目)
`guildScheduledEventUpdate`event 発生時に本機能が実行される。  
引数は`(oldGuildScheduledEvent,newGuildScheduledEvent)`  

`guildScheduledEvent`の各ステータスコードは[こちら](https://discord.js.org/docs/packages/discord.js/14.17.3/GuildScheduledEventStatus:Enum)  
アクティブ状態のステータスコードは`2`なので、イベントが開始したかどうかは、以下のように判定する。
```
if(oldGuildScheduledEvent.status !== 2 && newGuildScheduledEvent.status === 2)
```
また、イベントが終了した状態のステータスコードは`3`なので、イベントが終了したかどうかは、以下のように判定する。
```
if(oldGuildScheduledEvent.status !== 3 && newGuildScheduledEvent.status === 3)
```


## アクティビティ開始の通知
### 機能概要
Discord上で外部アプリ等と連携している場合、そのアプリをアクティビティとしてプロフィール下に表示することができる(以下)。  
![activity](https://github.com/user-attachments/assets/54f0fed7-36d6-4d90-9546-85ee81dbfa5f)
  
本機能では、VCにいるユーザーがアクティビティを開始したとき、その旨が通知される(以下)。  
![startActivity](https://github.com/user-attachments/assets/b58d0353-eaf9-4f23-bab2-09e94f26e341)
  

### 実装(index.js 92~125行目)
`presenceUpdate`event 発生時に本機能が実行される。  
引数は`(oldPresence,newPresence)`(`presence`クラスの詳細は[こちら](https://discord.js.org/docs/packages/discord.js/14.18.0/Presence:Class))  

`const newActivities = newPresence.activities;`により、`newPresence`でのアクティビティを取得可能(index.js 109行目)。  
newActivityがoldActivitiesに存在しなければ、newActivityを新しく開始したアクティビティとして通知する。


  
## イベント予告通知
### 機能概要
サーバーイベントの開始1週間前から、`イベント開始まであとn日`という形で通知する機能。  
以下のような感じ。  
(後ほど掲載予定)

### 実装(index.js 130~164行目)
本機能は、イベント開始1週間前になった際、毎日定刻に通知を送る。  
定刻に通知を送信するために、[node-cron](https://www.npmjs.com/package/node-cron)を使用する。  

本機能は毎日8:00になったときに通知を送るので、以下のように記述する。  
```
cron.schedule('0 0 8 * * *' async() => {/* 通知機能 */})
```

`const events = await guild.scheduledEvents.fetch();`により、サーバー上のイベント情報を取得する(index.js 145行目)。  
`events.forEach()`で、各イベントを参照する。  
サーバーイベントの開始予定時刻は、以下のようにタイムスタンプ形式で取得可能(単位はms, idnex.js 147行目)。
```
const start_ts = event.scheduledStartTimestamp;
```
現在時刻のタイムスタンプは`const now_ts = new Date().getTime();`で取得可能(index.js 131行目)。  
したがって、これらの差分(`const diff = start_ts - now_ts;`, index.js 150行目)が7日分以下であれば、イベントが予定されたサーバーに通知を送る。  
