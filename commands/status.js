const game_engine = require('../game_engine/game_engine')

const command_name = 'status';
const command_description = 'Gibt den momentanen Spielstatus aus.';

module.exports = {
    name: command_name,
    description: command_description,
    execute(message, args) {
        console.log(`[${message.guild.name}] [${message.channel.name}] Executing "${command_name}" command with the following arguments: "${args}".`);

        let [result, game_state] = game_engine.get_game_status(game_engine.create_game_state_index(message.guild.name, message.channel.name));
        if (result === game_engine.RESULT_GAME_DOES_NOT_EXIST) {
            message.channel.send('In diesem Channel gibt es kein aktives Billardspiel.');
            return;
        }

        if (game_state.balls.length === 0) {
            message.channel.send('Alle Kugeln wurden eingelocht.');
            return;
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
        message.channel.send(status);
    },
};