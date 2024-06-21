// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const axios = require('axios');
// Bot token
const token = process.env.DISCORD_BOT_TOKEN;
var ayat;
// When the bot is ready
client.once('ready', async () => {
    try {
        const res = await axios.get("https://api.quran.com/api/v4/quran/verses/indopak");
        ayat = res.data.verses;
        console.log(ayat);
    } catch (error) {
        console.error('Error fetching ayat:', error);
    }
});

// Respond to messages
client.on('messageCreate', message => {
    if (message.content === 'start quran' && ayat) {
        const customMessage = `Quran started \n **متنساش تدعي لاخوك ابوزيد**`;
        message.channel.send(customMessage);
        if (!client.interval) {
            let i = 0;
            client.interval = setInterval(() => {
                if (i < ayat.length) {
                    const element = ayat[i];
                    const customMessage = `Ayah ${i + 1}\n***${element.text_indopak}***\n\n*[Made by Abouzaid]*`;
                    message.channel.send(customMessage);
                    i++;
                } else {
                    clearInterval(client.interval);
                    delete client.interval;
                }
            }, 60000); 
        }
    }
    if (message.content === 'stop quran') {
        if (client.interval) {
            clearInterval(client.interval);
            const customMessage = `Bot stopped \n **متنساش تدعي لاخوك ابوزيد**`;
            message.channel.send(customMessage);
            delete client.interval;
        }
    }
});

// Login to Discord
client.login(token);