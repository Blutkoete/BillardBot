const Discord = require('discord.js')

const token = require('./token')

const channel_id = '405048908784336896'

const client = new Discord.Client()

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
    // List servers the bot is connected to
    console.log("Servers:")
    for (let [key, value] of client.guilds.cache) {
        console.log("--- "  + key + " " + value.name)
    }
});

client.on('message', message => {
    if (message.channel.id == channel_id) {
        if (message.content === '!ping') {
            message.channel.send('Pong.');
        }
    }
    else {
        console.log("Ignoring message in channel '" + message.channel.name + "' [" + message.channel.id + "].")
    }
});

client.login(token.bot_secret_token)