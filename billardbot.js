const Discord = require('discord.js')

const token = process.env.BOT_SECRET_TOKEN || require('./token').bot_secret_token;

const commands = require('./commands')

const client = new Discord.Client()

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
        console.log(`[${message.guild?.name}] Ignoring message from bot in ${message.channel.name} [${message.channel.id}].`);
        return;
    }
    var mentionsBot = message.mentions.users.has(client.user.id);
    if(!mentionsBot) {
        console.log(`[${message.guild?.name}] Ignoring message not mentioning me in ${message.channel.name} [${message.channel.id}].`);
        return;
    }

    const args = message.content.split(' ').slice(1);
    let command = args.shift().toLowerCase();

    let current_command = commands.command_none;
    for (let index in commands.available_commands) {
        if (commands.available_commands.hasOwnProperty(index)) {
            let available_command = commands.available_commands[index]
            if (command === available_command.command) {
                current_command = available_command;
                break;
            }
        }
    }

    if (current_command === commands.command_none) {
        console.log(`[${message.guild?.name}] Unknown command: "${message.content}"`);
        message.channel.send('Das Kommando verstehe ich leider nicht.');
        return;
    }

    if (args.length !== current_command.argument_count) {
        console.log(`[${message.guild?.name}] Wrong number of arguments for command "${current_command.command}": "{message.content}" (${current_command.argument_count} expected)`);
        if (current_command.argument_count === 0) {
            message.channel.send('Das geht nur ohne zusätzliches Argument.');
        }
        else if (current_command.argument_count === 1)
        {
            message.channel.send('Das geht nur mit genau einem zusätzlichen Argument.');
        }
        else
        {
            message.channel.send(`Das geht nur mit ${current_command.argument_count} zusätzlichen Argumenten.`);
        }
        return;
    }

    message.channel.send(current_command.callback(message.guild?.name, message.channel.name, args));
});

client.login(token)