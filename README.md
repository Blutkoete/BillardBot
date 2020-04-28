# Discord BillardBot
As our monthly billard meeting has been moved to Discord due to the current circumstances, we need a simple bot that allows us to play billard there.

## Usage
The bot can host one game per server-channel pair. Start a new game with:

    !bb neu
    
If you want an overview which balls are left on the table, use:

    !bb status
    
To simply push the white ball with brute force along the table, use:

    !bb haudrauf
    
To aim for a specific ball, use:

    !bb stoss <ball>
    
Ball names are _1halb_, _1voll_, _2halb_, _2voll_, _3halb_, _3voll_, _4halb_, _4voll_, _5halb_, _5voll_,
_6halb_, _6voll_, _7halb_, _7voll_ and _8_.

To get online help, use:

    !bb hilfe
    
### Note
The game does not track turnorder in any way. 
