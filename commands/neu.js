const game_engine = require('../game_engine/game_engine')

const command_name = 'neu';
const command_description = 'Beginnt ein neues Spiel.';

module.exports = {
    name: command_name,
    description: command_description,
    execute(message, args) {
        console.log(`[${message.guild.name}] [${message.channel.name}] Executing "${command_name}" command with the following arguments: "${args}".`);

        if (game_engine.create_new_game(game_engine.create_game_state_index(message.guild.name, message.channel.name)) === game_engine.RESULT_GAME_STARTED) {
            message.channel.send('Die Kugeln wurden neu aufgebaut.');
            return;
        }

        message.channel.send('Internal Bot Error');
    },
};