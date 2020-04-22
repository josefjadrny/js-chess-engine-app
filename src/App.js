import React, { useState, useEffect } from 'react';
import Field from './Field';
import { NEW_GAME_BOARD_CONFIG, ROWS, COLUMNS, COLORS } from './const/board'
import './App.css';

function App() {
    const [chess, setChess] = useState(NEW_GAME_BOARD_CONFIG)
    const board = getBoard()

    useEffect(() => {
        getMoves(chess).then(moves => setChess(Object.assign({}, chess, { moves })))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chess.turn])

    return (
        <div className="board">
            {board}
        </div>
    )

    function getBoard() {
        const fields = []
        Object.assign([], ROWS).reverse().map(row => {
            return COLUMNS.map(column => {
                const location = `${column}${row}`
                return fields.push(<Field
                    location={location}
                    key={`field-${location}`}
                    onClick={() => handleFieldClick(location) }
                    chess={chess}
                />)
            })
        })
        return fields
    }

    function handleFieldClick(field) {
        if (chess.move.from && chess.moves[chess.move.from].includes(field)) {
            const newPieces = Object.assign({}, chess.pieces,
                {[field]: chess.pieces[chess.move.from]},
                {[chess.move.from]:null},
            )
            setChess(Object.assign(
                {},
                chess,
                { move:{ from: null }},
                { pieces: newPieces },
                { turn: chess.turn === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE }
            ))
        } else if (chess.moves[field]) {
            setChess(Object.assign({}, chess, { move:{ from: field }}))
        } else {
            setChess(Object.assign({}, chess, { move:{ from: null }}))
        }
    }

    async function getMoves(chess) {
        const res = await fetch(
            `${process.env.REACT_APP_JS_CHESS_API}moves`,
            { method: 'POST', body: JSON.stringify(chess), headers: { 'Content-Type': 'application/json' }}
        )
        return res.json().then(res => {return res})
    }
}

export default App
