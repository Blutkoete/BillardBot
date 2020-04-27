const Discord = require('discord.js')

const token = require('token.js')

const client = new Discord.Client()
client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
    // List servers the bot is connected to
    console.log("Servers:")
    for (let [key, value] of client.guilds.cache) {
        console.log("--- "  + value.name)
    }
});

client.login(token.bot_secret_token)