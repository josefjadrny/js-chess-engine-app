import React, { useState, useEffect } from 'react'
import Field from './Field';
import PersistState from './PersistState';
import RightColumn from './RightColumn.js'
import {NEW_GAME_BOARD_CONFIG, ROWS, COLUMNS, COLORS, SETTINGS, PERSIST_STATE_NAMESPACE} from './const/board'
import ReactGA from 'react-ga';
import { get } from 'local-storage'
import './App.css'
const API_URIS = {
    MOVES: 'moves',
    STATUS: 'status',
    MOVE: 'move',
    AI_MOVE: 'aimove'
}

ReactGA.initialize(process.env.REACT_APP_ANALYTICS_CODE)
ReactGA.pageview(window.location.pathname + window.location.search)

function App() {
    const savedSettings = get(`${PERSIST_STATE_NAMESPACE}_settings`)
    const savedChess = get(`${PERSIST_STATE_NAMESPACE}_chess`)
    const [chess, setChess] = useState(
        savedChess && typeof savedChess === 'object' ? Object.assign({}, NEW_GAME_BOARD_CONFIG, savedChess) : { ...NEW_GAME_BOARD_CONFIG }
        )
    const [settings, setSettings] = useState(
        savedSettings && typeof savedSettings === 'object' ? Object.assign({}, SETTINGS, savedSettings) : { ...SETTINGS }
        )
    const [loading, setLoading] = useState(false)
    const board = getBoard()

    useEffect(() => {
        getMoves()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (chess.turn === COLORS.BLACK) {
            aiMove()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chess.turn])

    return (
        <div className={`js_chess ${loading ? 'loading' : ''}`}>
            <div className="column column_left">
                <div className="overlay">
                    <div className={`board ${chess.isFinished ? 'finished' : ''}`} disabled={chess.isFinished || loading}>
                        {board}
                    </div>
                </div>
            </div>
            <div className="column column_right">
                <div className="menu">
                    <RightColumn chess={chess}
                                 settings={settings}
                                 loading={loading}
                                 onNewGameClick={() => handleNewGameClick() }
                                 onComputerLevelClick={handleChangeComputerLevelClick}
                                 onConfirmationToggleClick={() => handleChangeConfirmationToggleClick() }
                                 onConfirmationClick={() => handleChangeConfirmationClick() }
                    />
                </div>
                <PersistState
                    settings={settings}
                    chess={chess}
                />
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
                    settings={settings}
                />)
            })
        })
        return fields
    }

    async function handleFieldClick(field) {
        if (chess.move.from && chess.moves[chess.move.from].includes(field)) {
            chess.move.to = field
            await setChess({...chess})
            if (settings.confirmation) {

            } else {
                return performMove(chess.move.from, chess.move.to)
            }
        } else if (chess.moves[field]) {
            setChess(Object.assign({}, chess, { move:{ from: field }}))
        } else {
            setChess(Object.assign({}, chess, { move:{ from: null }}))
        }
    }

    async function performMove (from, to) {
        chess.history.push({ from, to })
        chess.move.from = from
        chess.move.to = to
        setChess(Object.assign({},  chess, { move: {} }, await sendRequest(API_URIS.MOVE) ))
    }

    async function aiMove() {
        const aiMove = await sendRequest(`${API_URIS.AI_MOVE}?level=${settings.computerLevel}`)
        const from = Object.keys(aiMove)[0]
        const to = Object.values(aiMove)[0]
        return await performMove(from, to)
    }

    async function getMoves () {
        const moves = await sendRequest(API_URIS.MOVES)
        setChess(Object.assign({}, chess, { moves }))
    }

    async function handleNewGameClick() {
        await setChess(Object.assign(chess, {pieces: {}}, NEW_GAME_BOARD_CONFIG))
        await getMoves()
    }

    async function sendRequest(url) {
        await setLoading(true)
        const res = await fetch(
            `${process.env.REACT_APP_JS_CHESS_API}${url}`,
            { method: 'POST', body: JSON.stringify(chess), headers: { 'Content-Type': 'application/json' }}
        )
        await setLoading(false)
        return res.json().then(res => {return res})
    }

    async function handleChangeComputerLevelClick(level) {
        await setSettings(Object.assign({}, settings, {computerLevel: level}))
    }

    async function handleChangeConfirmationToggleClick() {
        await setSettings(Object.assign({}, settings,{confirmation: settings.confirmation ? false : true}))
    }

    async function handleChangeConfirmationClick() {
        return performMove(chess.move.from, chess.move.to)
    }
}

export default App
