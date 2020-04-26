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

    return (
        <div className={`field piece${piece} ${moveFromClass} ${moveToClass}`} onClick={onClick}>
        </div>
    )
}

export default Field
