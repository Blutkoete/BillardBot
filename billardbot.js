const fs = require('fs');
const Discord = require('discord.js')

const token = process.env.BOT_SECRET_TOKEN || require('./token').bot_secret_token;

const client = new Discord.Client()
client.commands = new Discord.Collection();
const command_files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of command_files) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}`);
    // List servers the bot is connected to
    console.log('Servers:');
    for (let [key, value] of client.guilds.cache) {
        console.log(`\t[${key}] ${value.name}`);
    }
});

client.on('message', message => {
    if (message.author.bot) {
        console.log(`[${message.guild.name}] [${message.channel.name}] Ignoring message from bot.`);
        return;
    }

    let mentionsBot = message.mentions.users.has(client.user.id);
    if(!mentionsBot) {
        console.log(`[${message.guild.name}] [${message.channel.name}] Ignoring message not mentioning me.`);
        return;
    }

    console.log(`[[${message.guild.name}] [${message.channel.name}] Reacting to message "${message.content}".`)

    const args = message.content.split(' ').slice(1);
    let command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
        message.channel.send('Das Kommando verstehe ich nicht.');
        return;
    }

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(`[${message.guild.name}] [${message.channel.name}] Error executing command "${command}".`);
        message.channel.send('Internal Bot Error');
    }
});

client.login(token)