import React, { useState, useEffect } from 'react';
import Field from './Field';
import RightColumn from './RightColumn.js';
import { NEW_GAME_BOARD_CONFIG, ROWS, COLUMNS, COLORS } from './const/board'
import './App.css';
const API_URIS = {
    MOVES: 'moves',
    STATUS: 'status',
}

function App() {
    const [chess, setChess] = useState(Object.assign({}, NEW_GAME_BOARD_CONFIG))
    const board = getBoard()

    useEffect(() => {
        async function fetchData () {
            const moves = await sendRequest(API_URIS.MOVES)
            setChess(Object.assign({}, chess, { moves }))
            if (!Object.keys(moves).length) {
                const status = await sendRequest(API_URIS.STATUS)
                setChess(Object.assign({}, chess, { status }))
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chess.pieces])

    return (
        <div className="js_chess">
            <div className="column column_left">
                <div className="overlay">
                    <div className="board" disabled={chess.status.isFinished}>
                        {board}
                    </div>
                </div>
            </div>
            <div className="column column_right">
                <div className="menu">
                    <RightColumn chess={chess} onClick={() => handleNewGameClick() }/>
                </div>
            </div>
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
            chess.history.push(`${chess.move.from}-${field}`)
        } else if (chess.moves[field]) {
            setChess(Object.assign({}, chess, { move:{ from: field }}))
        } else {
            setChess(Object.assign({}, chess, { move:{ from: null }}))
        }
    }

    function handleNewGameClick() {
        setChess(Object.assign({}, NEW_GAME_BOARD_CONFIG))
    }

    async function sendRequest(url) {
        const res = await fetch(
            `${process.env.REACT_APP_JS_CHESS_API}${url}`,
            { method: 'POST', body: JSON.stringify(chess), headers: { 'Content-Type': 'application/json' }}
        )
        return res.json().then(res => {return res})
    }
}

export default App
