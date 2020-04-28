const game_engine = require('./game_engine')

function log_command(server_name, channel_name, command, arguments)
{
    console.log('[' + server_name + '] Executing command "' + command + '" for channel "' + channel_name + '" with the following arguments: ' + arguments)
}

function callback_none(server_name, channel_name, arguments) {
    log_command(server_name, channel_name, 'none', arguments)
    return 'Internal Bot Error';
}

function callback_neu(server_name, channel_name, arguments) {
    log_command(server_name, channel_name, 'neu', arguments)

    let key = game_engine.create_game_state_index(server_name, channel_name);
    if (key in game_engine.current_game_states) {
        game_engine.current_game_states[key].balls = game_engine.initial_game_state.balls.slice();
    }
    else {
        game_engine.current_game_states[key] = { 'balls': game_engine.initial_game_state.balls.slice() };
    }
    return 'Die Kugeln wurden neu aufgebaut.';
}

function callback_stoss(server_name, channel_name, arguments) {
    log_command(server_name, channel_name, 'stoss', arguments)

    if (arguments.length !== 1) {
        return 'Internal Bot Error';
    }

    let key = game_engine.create_game_state_index(server_name, channel_name);
    if (!(key in game_engine.current_game_states)) {
        return 'In diesem Channel gibt es kein aktives Billardspiel.';
    }

    if (game_engine.current_game_states[key].balls.indexOf('8') < 0) {
        return 'Die schwarze 8 ist aus dem Spiel. Du musst !neu aufbauen.';
    }

    if (game_engine.current_game_states[key].balls.indexOf(arguments[0]) < 0) {
        return 'Diese Kugel ist nicht im Spiel.';
    }

    const lucky_number = Math.random();

    if (lucky_number <= game_engine.ball_deposit_chance)
    {
        game_engine.current_game_states[key].balls.splice(game_engine.current_game_states[key].balls.indexOf(arguments[0]), 1);

        if(arguments[0] === '8') {
            if (game_engine.current_game_states[key].balls.length === 0) {
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

function callback_haudrauf(server_name, channel_name, arguments) {
    log_command(server_name, channel_name, 'haudrauf', arguments)
    return 'Leider noch nicht implementiert!';
}

function callback_status(server_name, channel_name, arguments) {
    log_command(server_name, channel_name, 'status', arguments)

    let key = game_engine.create_game_state_index(server_name, channel_name);
    if (!(key in game_engine.current_game_states)) {
        return 'In diesem Channel gibt es kein aktives Billardspiel.';
    }

    if (game_engine.current_game_states[key].balls.length === 0) {
        return 'Alle Kugeln wurden eingelocht.';
    }

    let status = 'Vorhandene Kugeln: '
    for(let index in game_engine.current_game_states[key].balls)
    {
        if (game_engine.current_game_states[key].balls.hasOwnProperty(index)) {
            status = status + game_engine.current_game_states[key].balls[index];
            if (index < game_engine.current_game_states[key].balls.length - 1) {
                status = status + ", ";
            } else {
                status = status + ".";
            }
        }
    }
    return status;
}

function callback_hilfe(server_name, channel_name, arguments) {
    log_command(server_name, channel_name, 'hilfe', arguments)
    return 'Leider noch nicht implementiert!';
}

const command_none = {'command': 'none', 'argument_count': 0, 'callback': callback_none}
const command_neu = {'command': 'neu', 'argument_count': 0, 'callback': callback_neu}
const command_stoss = {'command': 'stoss', 'argument_count': 1, 'callback': callback_stoss}
const command_haudrauf = {'command': 'haudrauf', 'argument_count': 0, 'callback': callback_haudrauf}
const command_status = {'command': 'status', 'argument_count': 0, 'callback': callback_status}
const command_hilfe = {'command': 'hilfe', 'argument_count': 0, 'callback': callback_hilfe}
const available_commands = [command_neu, command_stoss, command_haudrauf, command_status, command_hilfe]

module.exports = {
    command_none: command_none,
    command_neu: command_neu,
    command_stoss: command_stoss,
    command_haudrauf: command_haudrauf,
    command_status: command_status,
    command_hilfe: command_hilfe,
    available_commands: available_commands
};