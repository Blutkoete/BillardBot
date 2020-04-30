const game_engine = require('../game_engine/game_engine')

const command_name = 'stoss';
const command_description = 'Führt einen Billardstoß aus.';

module.exports = {
    name: command_name,
    description: command_description,
    execute(message, args) {
        console.log(`[${message.guild.name}] [${message.channel.name}] Executing "${command_name}" command with the following arguments: "${args}".`);

        if (args.length !== 1) {
            message.channel.send('Internal Bot Error');
            return;
        }

        let result = game_engine.strike_ball(game_engine.create_game_state_index(message.guild.name, message.channel.name), arguments[0]);
        switch (result) {
            case game_engine.RESULT_GAME_DOES_NOT_EXIST:
                message.channel.send('In diesem Channel gibt es kein aktives Billardspiel.');
                break;
            case game_engine.RESULT_GAME_IS_NOT_OPENED:
                message.channel.send('Ein Spiel beginnt man mit "haudrauf".)');
                break;
            case game_engine.RESULT_GAME_IS_ALREADY_OVER:
                message.channel.send('Die schwarze 8 ist aus dem Spiel. Du musst "neu" aufbauen.');
                break;
            case game_engine.RESULT_BALL_NOT_AVAILABLE:
                message.channel.send('Diese Kugel ist nicht im Spiel.');
                break;
            case game_engine.RESULT_BALL_DEPOSITED:
                message.channel.send('Eingelocht!');
                break;
            case game_engine.RESULT_BALL_NOT_DEPOSITED:
                message.channel.send('Leider nicht eingelocht.');
                break;
            case game_engine.RESULT_BLACK_EIGHT_DEPOSITED_LOST:
                message.channel.send('Die schwarze 8 wurde zu früh eingelocht! Verloren!');
                break;
            case game_engine.RESULT_BLACK_EIGHT_DEPOSITED_WON:
                message.channel.send('Eingelocht! Gewonnen!');
                break;
            default:
                message.channel.send("Internal Bot Error");
        }
    },
};