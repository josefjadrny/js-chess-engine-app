import React, { useState, useEffect } from 'react';
import Field from './Field';
import RightColumn from './RightColumn.js';
import { NEW_GAME_BOARD_CONFIG, ROWS, COLUMNS } from './const/board'
import './App.css';
const API_URIS = {
    MOVES: 'moves',
    STATUS: 'status',
    MOVE: 'move'
}

function App() {
    const [chess, setChess] = useState({ ...NEW_GAME_BOARD_CONFIG })
    const board = getBoard()

    useEffect(() => {
        getMoves()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="js_chess">
            <div className="column column_left">
                <div className="overlay">
                    <div className="board" disabled={chess.isFinished}>
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

    async function handleFieldClick(field) {
        if (chess.move.from && chess.moves[chess.move.from].includes(field)) {
            chess.move.to = field
            chess.history.push(`${chess.move.from}-${field}`)
            setChess(Object.assign({},  chess, {move: {} }, await sendRequest(API_URIS.MOVE)))
        } else if (chess.moves[field]) {
            setChess(Object.assign({}, chess, { move:{ from: field }}))
        } else {
            setChess(Object.assign({}, chess, { move:{ from: null }}))
        }
    }

    async function getMoves () {
        const moves = await sendRequest(API_URIS.MOVES)
        setChess(Object.assign({}, chess, { moves }))
    }

    async function handleNewGameClick() {
        await setChess(Object.assign(chess, {pieces: {}}, NEW_GAME_BOARD_CONFIG))
        chess.history.push(`NEW`)
        await getMoves()
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
