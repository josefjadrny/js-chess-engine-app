import React from 'react';

function Field(props) {
    const {
        onClick,
        location,
        chess
    } = props

    const piece = chess.pieces[location] || ''
    const moveFromClass = chess.move.from === location ? 'moveFrom' : ''
    const moveToClass = chess.move.from && chess.moves && chess.moves[chess.move.from].includes(location) ? 'moveTo' : ''
    const historyClass = chess.history.length &&
        (chess.history[chess.history.length - 1].from === location ||
        chess.history[chess.history.length - 1].to === location) ? 'lastMove' : ''

    return (
        <div className={`field piece${piece} ${moveFromClass} ${moveToClass} ${historyClass}`} onClick={onClick}>
        </div>
    )
}

export default Field
