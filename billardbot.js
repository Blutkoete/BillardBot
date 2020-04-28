const Discord = require('discord.js')

const token = require('./token')
const commands = require('./commands')

const bot_prefix = 'bb'

const client = new Discord.Client()

client.on('ready', () => {
    console.log('Connected as ' + client.user.tag);
    // List servers the bot is connected to
    console.log('Servers:');
    for (let [key, value] of client.guilds.cache) {
        console.log('\t['  + key + '] ' + value.name);
    }
});

client.on('message', message => {
    if (message.author.bot) {
        console.log('[' + message.guild.name + '] Ignoring message from bot in "' + message.channel.name + '" [' + message.channel.id + '].');
        return;
    }

    if (!message.content.startsWith('!' + bot_prefix + ' ')) {
        console.log('[' + message.guild.name + '] Ignoring message not starting with "!' + bot_prefix + '" in "' + message.channel.name + '" [' + message.channel.id + '].');
        return;
    }

    let arguments = message.content.slice(('!' + bot_prefix + ' ').length).split(' ');
    let command = arguments.shift().toLowerCase();

    let current_command = commands.command_none;
    for (index in commands.available_commands) {
        let available_command = commands.available_commands[index]
        if (command == available_command.command)
        {
            current_command = available_command;
            break;
        }
    }

    if (current_command == commands.command_none) {
        console.log('Unknown command: "' + message.content + '"');
        message.channel.send('Das Kommando verstehe ich leider nicht.');
        return;
    }

    if (arguments.length != current_command.argument_count) {
        console.log('[' + message.guild.name + '] Wrong number of arguments for command "' + current_command.command + '": "' + message.content + '" (' + current_command.argument_count + ' expected)');
        if (current_command.argument_count == 0) {
            message.channel.send('Das geht nur ohne zusätzliches Argument.');
        }
        else if (current_command.argument_count == 1)
        {
            message.channel.send('Das geht nur mit genau einem zusätzlichen Argument.');
        }
        else
        {
            message.channel.send('Das geht nur mit ' + current_command.argument_count + ' zusätzlichen Argumenten.');
        }
        return;
    }

    message.channel.send(current_command.callback(message.guild.name, message.channel.name, arguments));
    return;
});

client.login(token.bot_secret_token)