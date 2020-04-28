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

    if (game_engine.create_new_game(game_engine.create_game_state_index(server_name, channel_name)) === game_engine.RESULT_GAME_STARTED) {
        return 'Die Kugeln wurden neu aufgebaut.';
    }

    return 'Internal Bot Error';
}

function callback_stoss(server_name, channel_name, arguments) {
    log_command(server_name, channel_name, 'stoss', arguments)

    if (arguments.length !== 1) {
        return 'Internal Bot Error';
    }

    let result = game_engine.strike_ball(game_engine.create_game_state_index(server_name, channel_name), arguments[0]);
    switch(result) {
        case game_engine.RESULT_GAME_DOES_NOT_EXIST:
            return 'In diesem Channel gibt es kein aktives Billardspiel.';
        case game_engine.RESULT_GAME_IS_NOT_OPENED:
            return 'Ein Spiel beginnt man mit !haudrauf.';
        case game_engine.RESULT_GAME_IS_ALREADY_OVER:
            return 'Die schwarze 8 ist aus dem Spiel. Du musst !neu aufbauen.';
        case game_engine.RESULT_BALL_NOT_AVAILABLE:
            return 'Diese Kugel ist nicht im Spiel.';
        case game_engine.RESULT_BALL_DEPOSITED:
            return 'Eingelocht!';
        case game_engine.RESULT_BALL_NOT_DEPOSITED:
            return 'Leider nicht eingelocht.';
        case game_engine.RESULT_BLACK_EIGHT_DEPOSITED_LOST:
            return 'Die schwarze 8 wurde zu früh eingelocht! Verloren!';
        case game_engine.RESULT_BLACK_EIGHT_DEPOSITED_WON:
            return 'Eingelocht! Gewonnen!';
        default:
            return "Internal Bot Error";
    }
}

function callback_haudrauf(server_name, channel_name, arguments) {
    log_command(server_name, channel_name, 'haudrauf', arguments)

    let [result, balls_deposited] = game_engine.strike_all_balls(game_engine.create_game_state_index(server_name, channel_name));
    switch(result) {
        case game_engine.RESULT_GAME_DOES_NOT_EXIST:
            return 'In diesem Channel gibt es kein aktives Billardspiel.';
        case game_engine.RESULT_GAME_IS_ALREADY_OVER:
            return 'Die schwarze 8 ist aus dem Spiel. Du musst !neu aufbauen.';
        case game_engine.RESULT_BALL_DEPOSITED:
            let deposited_result = 'Eingelochte Kugeln: ';
            for(let index in balls_deposited)
            {
                if (balls_deposited.hasOwnProperty(index)) {
                    deposited_result = deposited_result + balls_deposited[index];
                    if (index < balls_deposited.length - 1) {
                        deposited_result = deposited_result + ", ";
                    } else {
                        deposited_result = deposited_result + ".";
                    }
                }
            }
            return deposited_result;
        case game_engine.RESULT_BALL_NOT_DEPOSITED:
            return 'Leider nichts eingelocht.';
        case game_engine.RESULT_BLACK_EIGHT_DEPOSITED_LOST:
            let deposited_lost_result = 'Eingelocht: ';
            for(let index in balls_deposited)
            {
                if (balls_deposited.hasOwnProperty(index)) {
                    deposited_lost_result = deposited_lost_result + balls_deposited[index];
                    if (index < balls_deposited.length - 1) {
                        deposited_lost_result = deposited_lost_result + ', ';
                    } else {
                        deposited_lost_result = deposited_lost_result + '. ';
                    }
                }
            }
            deposited_lost_result = deposited_lost_result + 'Die schwarze 8 wurde zu früh eingelocht! Verloren!';
            return deposited_lost_result;
        case game_engine.RESULT_BLACK_EIGHT_DEPOSITED_WON:
            let deposited_won_result = 'Eingelocht: ';
            for(let index in balls_deposited)
            {
                if (balls_deposited.hasOwnProperty(index)) {
                    deposited_won_result = deposited_won_result + balls_deposited[index];
                    if (index < balls_deposited.length - 1) {
                        deposited_won_result = deposited_won_result + ', ';
                    } else {
                        deposited_won_result = deposited_won_result + '. ';
                    }
                }
            }
            deposited_won_result = deposited_won_result + 'Die schwarze 8 wurde eingelocht! Gewonnen!';
            return deposited_won_result;
        default:
            return "Internal Bot Error";
    }
}

function callback_status(server_name, channel_name, arguments) {
    log_command(server_name, channel_name, 'status', arguments)

    let [result, game_state] = game_engine.get_game_status(game_engine.create_game_state_index(server_name, channel_name));
    if (result === game_engine.RESULT_GAME_DOES_NOT_EXIST) {
        return 'In diesem Channel gibt es kein aktives Billardspiel.';
    }

    if (game_state.balls.length === 0) {
        return 'Alle Kugeln wurden eingelocht.';
    }

    let status = 'Vorhandene Kugeln: '
    for(let index in game_state.balls)
    {
        if (game_state.balls.hasOwnProperty(index)) {
            status = status + game_state.balls[index];
            if (index < game_state.balls.length - 1) {
                status = status + ", ";
            } else {
                status = status + ".";
            }
        }
    }
    return status;
}

function callback_hilfe(server_name, channel_name, arguments) {
    log_command(server_name, channel_name, 'hilfe', arguments);

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