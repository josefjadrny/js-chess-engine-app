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
    sound: true,
}
export const PERSIST_STATE_NAMESPACE = 'js_chess_app'
export const NEW_GAME_BOARD_CONFIG = {
    turn: COLORS.WHITE,
    pieces: {
        E1: 'K',
        D1: 'Q',
        A1: 'R',
        H1: 'R',
        C1: 'B',
        F1: 'B',
        B1: 'N',
        G1: 'N',
        A2: 'P',
        B2: 'P',
        C2: 'P',
        D2: 'P',
        E2: 'P',
        F2: 'P',
        G2: 'P',
        H2: 'P',
        E8: 'k',
        D8: 'q',
        A8: 'r',
        H8: 'r',
        C8: 'b',
        F8: 'b',
        B8: 'n',
        G8: 'n',
        A7: 'p',
        B7: 'p',
        C7: 'p',
        D7: 'p',
        E7: 'p',
        F7: 'p',
        G7: 'p',
        H7: 'p',
    },
    moves: {},
    move: {},
    history: [],
    isFinished: false,
    chesMate: false,
    castling: {},
    counters: {
        fullMove: 0,
        halfMove: 0,
    },
}
export const MOVE_SOUND = 'UklGRnwFAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YYgEAAANAG4A5AAmAO4ANAHfAM0AsACXAOMAQwEDAVUAzwC8AP0A0gClAPwA/QBxAFsAXADEAC4BtQDrAC4BNgEbAhUEfQjzEMQcQSzAOrpEOEeNPXYdmerdxeG0uqearpSzbLRfvMjRZPUpJrNTF3Izbw9dsDnNFxjy3doAzTrQU9IW12HTpdhu30brKPVm/+QMWBjJHh0bZBQADoYGRvy+9ATvROs76Lvgitcg08DV49+u8xwLoyD+Lm0xaC1VI30ZsRQeDcj/oO7B2A7IM776vv3Kp+BL9d4LNBoPIzAmNy61Mjc2RzawMgQnrxiQCDf37Omb4ararNZW1zPbu+Ii7Mr4AgcpFt0j0i0mMEUqNB2oDHH9Tu2X4rnYHtKizCvM09K23p7wWQVRGDIlEyiHJd0dYRAoB74At/q294/10/E38BLvCfCm9C79MAX0C2QPmRCKD8kObwxuCNYD3v1g+LryKuzF5+jlFObN6ATwA/et/i4FmAi0DE0PZBEPEi4SUg9tCpIELv+b+db08/EW8avxSvKz8lTzh/Rs9uT4Ovud/ab/igDPARICXgJCAocBYQG6AL//Sf+//2cBhQNoBpwJkAw3DtEO9Q2HDL4J/QR7/3v6UPUg8A3tcOr+6T/rHu7A8mv5pv8uBpwKlgzTDaINBAzMCXAGhAKo/9v8qvo8+f74K/mr+f/5Kvr/+c75GPk3+Lr3i/cL+OX4P/p5+139wv/9AUUEOQbRB3YIFQjxBtYFiQR7A2ICAAH+/s78PPp49wH10fIP8eTvOu9d77TwVfLQ9A33evnt+3D+rgE4BHoFbAYUBhwGPgXCBFQD3wAj/1z9DPyc+yX8Bv5D/xYA8f+n/nr9E/zt+gj6w/nf+fP5hfo6+7/86v5wAbEDqAWMBuYGPQczB8IGIgYFBSQDbQFPAKP/gP6f/Y79Of38/Qr/RAAoAUECAgPqAgcD+QJ+A/wCigL7AToB8QC7AFsBRwLlAiQD9QLRApsCOQLlAfgAGwD7/iP+xv2n/ev9y/6S/vr9Q/1w/Hf8p/xQ/Mr8Pf3q/T3/IAFAAzYEGQTyA9oDbwO0AqoBrQBD/6f9evy3++L6AftO+9j79/t9+7/63/m8+LL3HPfu9uX2U/fC9xz5LPsg/cH+BwAxAf0BGgI7An8CRAKxAqMCGQJaAY8Ae/9T/nX9SPxC+5f6JPrp+av5afm7+RT6WPoS+7z7nPyI/aL+yf+zAJEBgwJVA9YD+wOTA1sDqQJoAqQB+QCFAOH/Fv/3/Rb9avzs+/L7Gvxf/J/8jPx8/Jz8C/1F/eb9zf51/2kAcgEZAmMCowJyAhkCygEsAVUAj//i/mP+x/1u/XH9wf00/oD+Pf7G/c/97f0L/lT+nP70/uH+nf65/h3/uv/k/7X/Zf8F/1P++P2k/TH9wvxL/Mf7Yftb+4n77vsy/D78rPxD/Xf90/1l/qP+GP9m//L/sgAoAUUBZgG2AZIB0QE3AqUC1wLFAtcCmwL5Ad0B1AGAAd4BDwI3Am0CnAKsAmkC4AFaAYsAFQBi/2j/IP+8/kxJU1RUAAAASU5GT0lOQU0YAAAAY2hlc3NfbW92ZV9vbl9hbGFiYXN0ZXIASUFSVAYAAABtaDJvAABJQ1JEBgAAADIwMTYAAElHTlIMAAAAU291bmQgQ2xpcAAAaWQzIGwAAABJRDMEAEAAAABhAAAADAEgBQsuT0NfVENPTgAAAAsAAABTb3VuZCBDbGlwVElUMgAAABgAAABjaGVzc19tb3ZlX29uX2FsYWJhc3RlclREUkMAAAAFAAAAMjAxNlRQRTEAAAAFAAAAbWgybwA='
