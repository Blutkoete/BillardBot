const Discord = require('discord.js')

const token = require('./token')

function callback_none(arguments) {
    return 'Internal Bot Error';
}

function callback_neu(arguments) {
    return 'Leider noch nicht implementiert!';
}

function callback_stoss(arguments) {
    return 'Leider noch nicht implementiert!';
}

function callback_haudrauf(arguments) {
    return 'Leider noch nicht implementiert!';
}

function callback_status(arguments) {
    return 'Leider noch nicht implementiert!';
}

function callback_hilfe(arguments) {
    return 'Leider noch nicht implementiert!';
}

const command_none = {'command': 'none', 'argument_count': 0, 'callback': callback_none}
const command_neu = {'command': 'neu', 'argument_count': 0, 'callback': callback_neu}
const command_stoss = {'command': 'stoss', 'argument_count': 1, 'callback': callback_stoss}
const command_haudrauf = {'command': 'haudrauf', 'argument_count': 0, 'callback': callback_haudrauf}
const command_status = {'command': 'status', 'argument_count': 0, 'callback': callback_status}
const command_hilfe = {'command': 'hilfe', 'argument_count': 0, 'callback': callback_hilfe}
const available_commands = [command_neu, command_stoss, command_haudrauf, command_status, command_hilfe]

const channel_id = '405048908784336896'

const client = new Discord.Client()

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    // List servers the bot is connected to
    console.log("Servers:");
    for (let [key, value] of client.guilds.cache) {
        console.log("--- "  + key + " " + value.name);
    }
});

client.on('message', message => {
    if (message.author.bot) {
        console.log("Ignoring message from bot in '" + message.channel.name + "' [" + message.channel.id + "].");
        return;
    }

    if (!message.content.startsWith('!')) {
        console.log("Ignoring message not starting with '!' in '" + message.channel.name + "' [" + message.channel.id + "].");
        return;
    }

    if (message.channel.id != channel_id) {
        console.log("Ignoring message in channel '" + message.channel.name + "' [" + message.channel.id + "].");
        return;
    }

    let valid_command = false;
    let current_command = command_none;
    for (index in available_commands) {
        available_command = available_commands[index]
        if (message.content.startsWith('!' + available_command.command))
        {
            current_command = available_command;
            valid_command = true;
            break;
        }
    }

    if (!valid_command) {
        console.log("Unknown command: '" + message.content + "'");
        message.channel.send('Das Kommando verstehe ich leider nicht.');
        return;
    }

    let arguments = message.content.slice(('!' + current_command.command).length).split(' ').shift().toLowerCase();
    if (arguments.length != current_command.argument_count) {
        console.log("Wrong number of arguments for command '" + current_command.command + "': '" + message.content + "' (" + current_command.argument_count + " expected)");
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

    message.channel.send(current_command.callback(arguments));
    return;
});

client.login(token.bot_secret_token)