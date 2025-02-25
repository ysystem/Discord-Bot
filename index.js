const cron = require('node-cron');
const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, GuildScheduledEventStatus } = require('discord.js');
const client = new Client({ intents: [1,2,,128,256,512,1024,65536,32768] });
const dotenv = require('dotenv');


dotenv.config();

client.once("ready", async () => {
    console.log(new Date());
    console.log("Ready!");
});


// ユーザーがVCに参加/退出したとき、その旨を通知
client.on('voiceStateUpdate', (oldState,newState) => {
    //vcに参加
    if(oldState.channelId === null && newState.channelId !== null){
        notify("がVCに参加しました");
    }
    //vcから退室
    if(oldState.channelId !== null && newState.channelId === null){
        notify("がVCから退室しました");
    }

    function notify(message){
        const guild = oldState.guild;
        guild.members.fetch(oldState.id).then(
            member => {
                const username = (member.nickname === null?member.user.username:member.nickname);
                guild.channels.fetch().then(
                    channels => {
                        var cnt = 0;
                        channels.forEach(channel => {
                            if(channel.type === 0 && cnt === 0){
                                channel.send(`${username} ${message}`);
                                cnt++;
                            }
                        });
                    }
                )
            }
        )
        
    }
});

// イベントが作成されたとき、その旨を通知
client.on('guildScheduledEventCreate', (guildScheduledEvent) => {
    const guild = guildScheduledEvent.guild;
    guild.channels.fetch().then(
        channels => {
            var cnt = 0;
            channels.forEach(channel => {
                if(channel.type === 0 && cnt === 0){
                    channel.send(`イベントが作成されました！今すぐ確認しましょう\n${guildScheduledEvent}`)
                    cnt++;
                }
            })
        }
    )
})

client.on('guildScheduledEventUpdate', (oldGuildScheduledEvent,newGuildScheduledEvent) => {
    //イベント開始
    if(oldGuildScheduledEvent.status !== 2 && newGuildScheduledEvent.status === 2){
        notify("イベントが始まりました！");
    }
    //イベント終了
    if(oldGuildScheduledEvent.status !== 3 && newGuildScheduledEvent.status === 3){
        notify("イベントが終了しました");
    }

    function notify(message){
        const guild = newGuildScheduledEvent.guild;
        guild.channels.fetch().then(
            channels => {
                var cnt = 0;
                channels.forEach(channel => {
                    if(channel.type === 0 && cnt === 0){
                        channel.send(`${message}\n${newGuildScheduledEvent}`)
                        cnt++;
                    }
                })
            }
        )
    }
});


// ユーザーがVCにいるときにアクティビティを開始したら、その旨をテキストチャンネルで通知
client.on('presenceUpdate', async (oldPresence,newPresence) => {
    const userId = newPresence.user.id;
    const guildMember = await newPresence.guild.members.fetch(userId);
    const userName = (guildMember.nickname === null?guildMember.user.username:guildMember.nickname);
    var sendChannel;
    const channels = await guildMember.guild.channels.fetch();
    var cnt = 0;
    channels.forEach(channel => {
        if(channel.type === 0 && cnt === 0){
            cnt++;
            sendChannel = channel;
        }
    });

    // アクティビティ開始を通知
    if(guildMember.voice.channelId !== null){
        const oldActivities = oldPresence.activities;
        const newActivities = newPresence.activities;
        for(let i = 0; i < newActivities.length; i++){
            var updated = true;
            const activity = newActivities[i];
            const activityName = activity.name;
            for(let j = 0; j < oldActivities.length; j++){
                if(oldActivities[j].name === activityName){
                    updated = false;
                    break;
                }
            }
            if(updated){
                sendChannel.send(`${userName} が ${activityName} を開始しました`)
            }
        }
    }
});



// イベント予告
cron.schedule('0 0 8 * * *', async () => {
    const now_ts = new Date().getTime();
    const guilds = await client.guilds.fetch();
    guilds.forEach(async (OAuth2Guild) => {
        const guild = await OAuth2Guild.fetch();
        const channels = await guild.channels.fetch();
        var sendChannel;
        var cnt = 0;
        channels.forEach((channel) => {
            if(channel.type === 0 && cnt === 0){
                cnt++;
                sendChannel = channel;
            }
        });
        //console.log(sendChannel);
        const events = await guild.scheduledEvents.fetch();
        events.forEach(async (event) => {
            const start_ts = event.scheduledStartTimestamp;
            const threshold_1day = 1000*60*60*24;
            const threshold_7days = 1000*60*60*24*7;
            const diff = start_ts - now_ts;
            if(diff < 0 || diff > threshold_7days) return;
            var msg = `イベント開始まであと`;
            if(diff <= threshold_1day){
                msg += String(Math.floor(diff/(1000*60*60)));
                msg += "時間";
            }else if(diff <= threshold_7days){
                msg += String(Math.floor(diff/(1000*60*60*24)));
                msg += "日";
            }
            msg += `\n${event}`;
            sendChannel.send(msg);
        });
    });
});

if(!process.env.DISCORD_BOT_TOKEN){
    console.log('DISCORD_BOT_TOKENが設定されていません。');
    process.exit(1);
}

client.login( process.env.DISCORD_BOT_TOKEN );