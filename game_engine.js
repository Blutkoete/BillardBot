const ball_deposit_chance = 0.1;

const initial_game_state = {'balls': ['1halb', '1voll', '2halb', '2voll', '3halb', '3voll', '4halb', '4voll', '5halb', '5voll', '6halb', '6voll', '7halb', '7voll', '8']};
let current_game_states = {}

module.exports = {
    initial_game_state: initial_game_state,
    current_game_states: current_game_states,
    ball_deposit_chance: ball_deposit_chance,
};