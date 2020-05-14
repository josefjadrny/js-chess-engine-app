export const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
export const ROWS = ['1', '2', '3', '4', '5', '6', '7', '8']
export const COLORS = {
    BLACK: 'black',
    WHITE: 'white'
}
export const COMPUTER_LEVELS = {
    "Monkey": 0,
    "Beginner": 1,
    "Advanced": 2,
}
export const SETTINGS = {
    computerLevel: COMPUTER_LEVELS.Advanced,
    confirmation: false,
}
export const PERSIST_STATE_NAMESPACE = 'js_chess_app'
export const NEW_GAME_BOARD_CONFIG = {"turn":"black","pieces":{"E3":"K","D2":"R","E6":"B","A4":"P","F3":"Q","G3":"k","A5":"p","H3":"p"},
    moves: {},
    move: {},
    history: [],
    isFinished: false,
    chesMate: false
}

