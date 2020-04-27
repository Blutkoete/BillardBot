const Discord = require('discord.js')

const token = require('./token')

const initial_game_state = {'balls': ['1halb', '1voll', '2halb', '2voll', '3halb', '3voll', '4halb', '4voll', '5halb', '5voll', '6halb', '6voll', '7halb', '7voll', '8']}
let current_game_state = initial_game_state;
const ball_deposit_chance = 0.1;

function callback_none(arguments) {
    return 'Internal Bot Error';
}

function callback_neu(arguments) {
    current_game_state = initial_game_state;
    return 'Die Kugeln wurden neu aufgebaut.';
}

function callback_stoss(arguments) {
    if (arguments.length != 1) {
        return 'Internal Bot Error';
    }

    if (current_game_state.balls.indexOf('8') < 0) {
        return 'Die schwarze 8 ist aus dem Spiel. Du musst !neu aufbauen.';
    }

    if (current_game_state.balls.indexOf(arguments[0]) < 0) {
        return 'Diese Kugel ist nicht im Spiel.';
    }

    lucky_number = Math.random() * (1.0 - 0.0);

    if (lucky_number <= ball_deposit_chance)
    {
        current_game_state.balls.splice(current_game_state.balls.indexOf(arguments[0]), 1);

        if(arguments[0] == '8') {
            if (current_game_state.balls.length == 0) {
                return 'Eingelocht! Gewonnen!';
            }
            else
            {
                return 'Die schwarze 8 wurde zu früh eingelocht! Verloren!';
            }
        }

        return 'Eingelocht!';
    }

    return 'Leider nicht eingelocht.';
}

function callback_haudrauf(arguments) {
    return 'Leider noch nicht implementiert!';
}

function callback_status(arguments) {
    if (current_game_state.balls.length == 0) {
        return 'Alle Kugeln wurden eingelocht.';
    }

    var status = 'Vorhandene Kugeln: '
    for(index in current_game_state.balls)
    {
        status = status + current_game_state.balls[index];
        if (index < current_game_state.balls.length - 1) {
            status = status + ", ";
        }
        else
        {
            status = status + ".";
        }
    }
    return status;
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
        console.log("\t["  + key + "] " + value.name);
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

    let arguments = message.content.slice(('!' + current_command.command).length).split(' ');
    while(arguments.length > 0 && arguments[0] == '') {
        arguments.shift();
    }
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