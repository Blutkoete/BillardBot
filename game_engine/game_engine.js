const RESULT_GAME_STARTED = "Game started";
const RESULT_GAME_DOES_NOT_EXIST = "Game does not exist";
const RESULT_GAME_IS_NOT_OPENED = "Game was not opened yet";
const RESULT_GAME_IS_ALREADY_OVER = "Game is already over";
const RESULT_BALL_NOT_AVAILABLE = "Ball not avaiable";
const RESULT_BALL_DEPOSITED = "Ball deposited";
const RESULT_BALL_NOT_DEPOSITED = "Ball not deposited";
const RESULT_BLACK_EIGHT_DEPOSITED_WON = "Black Eight deposited correctly";
const RESULT_BLACK_EIGHT_DEPOSITED_LOST = "Black Eight deposited incorrectly";

const ball_deposit_chance = 0.3;
const ball_deposit_chance_brute_force = 0.1;

const BLACK_EIGHT_NAME = '8';
const initial_game_state = {'balls': ['1halb', '1voll', '2halb', '2voll', '3halb', '3voll', '4halb', '4voll', '5halb', '5voll', '6halb', '6voll', '7halb', '7voll', BLACK_EIGHT_NAME]};
let current_game_states = {}

function create_game_state_index(id_major, id_minor) {
    return id_major + '::' + id_minor;
}

function create_new_game(game_state_index) {
    current_game_states[game_state_index] = { 'game_opened': false, 'balls': initial_game_state.balls.slice() };
    return RESULT_GAME_STARTED;
}

function strike_ball(game_state_index, ball) {
    if (!(game_state_index in current_game_states)) {
        return RESULT_GAME_DOES_NOT_EXIST;
    }

    if (!current_game_states[game_state_index].game_opened) {
        return RESULT_GAME_IS_NOT_OPENED;
    }

    if (current_game_states[game_state_index].balls.indexOf(BLACK_EIGHT_NAME) < 0) {
        return RESULT_GAME_IS_ALREADY_OVER;
    }

    if (current_game_states[game_state_index].balls.indexOf(ball) < 0) {
        return RESULT_BALL_NOT_AVAILABLE;
    }

    if (Math.random() <= ball_deposit_chance) {
        current_game_states[game_state_index].balls.splice(current_game_states[game_state_index].balls.indexOf(ball), 1);

        if (ball === BLACK_EIGHT_NAME) {
            if (current_game_states[game_state_index].balls.length === 0) {
                return RESULT_BLACK_EIGHT_DEPOSITED_WON;
            }
            else {
                return RESULT_BLACK_EIGHT_DEPOSITED_LOST;
            }
        }

        return RESULT_BALL_DEPOSITED;
    }

    return RESULT_BALL_NOT_DEPOSITED;
}

function strike_all_balls(game_state_index) {
    if (!(game_state_index in current_game_states)) {
        return [RESULT_GAME_DOES_NOT_EXIST, []];
    }

    if (current_game_states[game_state_index].balls.indexOf(BLACK_EIGHT_NAME) < 0) {
        return [RESULT_GAME_IS_ALREADY_OVER, []];
    }

    current_game_states[game_state_index].game_opened = true;
    let balls_deposited = []
    for (let index in current_game_states[game_state_index].balls)
    {
        if (current_game_states[game_state_index].balls.hasOwnProperty(index)) {
            if (Math.random() <= ball_deposit_chance_brute_force) {
                balls_deposited.push(current_game_states[game_state_index].balls[index]);
            }
        }
    }

    console.log(balls_deposited);
    for (let index in balls_deposited) {
        if(balls_deposited.hasOwnProperty(index)) {
            current_game_states[game_state_index].balls.splice(current_game_states[game_state_index].balls.indexOf(balls_deposited[index]), 1);
        }
    }

    if(current_game_states[game_state_index].balls.length === 0) {
        return [RESULT_BLACK_EIGHT_DEPOSITED_WON, balls_deposited];
    }
    else if (current_game_states[game_state_index].balls.indexOf(BLACK_EIGHT_NAME) < 0) {
        return [RESULT_BLACK_EIGHT_DEPOSITED_LOST, balls_deposited];
    }
    else if (balls_deposited.length > 0) {
        return [RESULT_BALL_DEPOSITED, balls_deposited];
    }

    return [RESULT_BALL_NOT_DEPOSITED, balls_deposited];
}

function get_game_status(game_state_index) {
    if (!(game_state_index in current_game_states)) {
        return [RESULT_GAME_DOES_NOT_EXIST, { 'game_opened': false, 'balls': initial_game_state.balls.slice() }];
    }

    return [RESULT_GAME_STARTED, current_game_states[game_state_index]];
}

module.exports = {
    RESULT_GAME_STARTED: RESULT_GAME_STARTED,
    RESULT_GAME_DOES_NOT_EXIST: RESULT_GAME_DOES_NOT_EXIST,
    RESULT_GAME_IS_NOT_OPENED: RESULT_GAME_IS_NOT_OPENED,
    RESULT_GAME_IS_ALREADY_OVER: RESULT_GAME_IS_ALREADY_OVER,
    RESULT_BALL_NOT_AVAILABLE: RESULT_BALL_NOT_AVAILABLE,
    RESULT_BALL_DEPOSITED: RESULT_BALL_DEPOSITED,
    RESULT_BALL_NOT_DEPOSITED: RESULT_BALL_NOT_DEPOSITED,
    RESULT_BLACK_EIGHT_DEPOSITED_WON: RESULT_BLACK_EIGHT_DEPOSITED_WON,
    RESULT_BLACK_EIGHT_DEPOSITED_LOST: RESULT_BLACK_EIGHT_DEPOSITED_LOST,
    create_game_state_index: create_game_state_index,
    create_new_game: create_new_game,
    strike_ball: strike_ball,
    strike_all_balls: strike_all_balls,
    get_game_status: get_game_status
};