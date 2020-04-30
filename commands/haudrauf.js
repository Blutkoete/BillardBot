const game_engine = require('../game_engine/game_engine')

const command_name = 'haudrauf';
const command_description = 'Haut einfach drauf.';

module.exports = {
    name: command_name,
    description: command_description,
    execute(message, args) {
        console.log(`[${message.guild.name}] [${message.channel.name}] Executing "${command_name}" command with the following arguments: "${args}".`);

        let [result, balls_deposited] = game_engine.strike_all_balls(game_engine.create_game_state_index(message.guild.name, message.channel.name));
        switch(result) {
            case game_engine.RESULT_GAME_DOES_NOT_EXIST:
                message.channel.send('In diesem Channel gibt es kein aktives Billardspiel.');
                break;
            case game_engine.RESULT_GAME_IS_ALREADY_OVER:
                message.channel.send('Die schwarze 8 ist aus dem Spiel. Du musst "neu" aufbauen.');
                break;
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
                message.channel.send(deposited_result);
                break;
            case game_engine.RESULT_BALL_NOT_DEPOSITED:
                message.channel.send('Leider nichts eingelocht.');
                break;
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
                message.channel.send(deposited_lost_result);
                break;
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
                message.channel.send(deposited_won_result);
                break;
            default:
                message.channel.send("Internal Bot Error");
        }
    },
};