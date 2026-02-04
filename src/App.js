import React, { useState, useEffect } from 'react'
import Field from './Field';
import PersistState from './PersistState';
import RightColumn from './RightColumn.js'
import {NEW_GAME_BOARD_CONFIG, ROWS, COLUMNS, COLORS, SETTINGS, PERSIST_STATE_NAMESPACE, MOVE_SOUND, TAKE_SOUND} from './const/board'
import ReactGA from 'react-ga';
import { get } from 'local-storage'
import './App.css'
const API_URIS = {
    MOVES: 'moves',
    STATUS: 'status',
    MOVE: 'move',
    AI_MOVE: 'ai-move'
}
const moveSound = new Audio(`data:audio/wav;base64,${MOVE_SOUND}`)
const takeSound = new Audio(`data:audio/wav;base64,${TAKE_SOUND}`)

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
        if (chess.turn === COLORS.BLACK && !chess.isFinished) {
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
                                 onSoundToggleClick={() => handleChangeSoundToggleClick() }
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
        if (!from || !to) {
            appendHistory({ from: 'Error', to: 'Invalid move (missing from/to)' })
            return
        }

        const piecesBefore = chess.pieces || {}
        const piecesBeforeCount = Object.keys(piecesBefore).length
        const destinationHadPiece = Object.prototype.hasOwnProperty.call(piecesBefore, to)

        chess.history.push({ from, to })
        chess.move.from = from
        chess.move.to = to

        const nextBoard = await sendRequest(API_URIS.MOVE, { from, to })
        if (!nextBoard) {
            return
        }
        // v2 server returns full board config after move
        const updatedChess = Object.assign({}, chess, { move: {} }, nextBoard)

        const piecesAfter = updatedChess.pieces || {}
        const piecesAfterCount = Object.keys(piecesAfter).length
        const isCapture = destinationHadPiece || (piecesAfterCount < piecesBeforeCount)

        // Always refresh legal moves for the side to move.
        // This prevents calling AI when the position is already finished.
        const nextMoves = await sendRequest(API_URIS.MOVES, { board: updatedChess })
        if (!nextMoves) {
            setChess(updatedChess)
            return
        }
        if (isMovesEmpty(nextMoves)) {
            setChess(Object.assign({}, updatedChess, {
                moves: {},
                isFinished: true,
                checkMate: !!updatedChess.check,
                staleMate: !updatedChess.check,
            }))
        } else {
            setChess(Object.assign({}, updatedChess, { moves: nextMoves }))
        }

        if (settings.sound) {
            const sound = isCapture ? takeSound : moveSound
            sound.currentTime = 0
            sound.play().catch(err => console.log('Sound play failed:', err))
        }
    }

    async function aiMove() {
        // v2 expects AI levels 1-5
        const aiMove = await sendRequest(API_URIS.AI_MOVE, { level: settings.computerLevel })

        // Some servers may respond with a string like "game finished".
        if (typeof aiMove === 'string') {
            return await handleAiFailure(`AI move failed (${aiMove})`)
        }

        if (!aiMove || typeof aiMove !== 'object' || Object.keys(aiMove).length === 0) {
            return await handleAiFailure('AI move failed (empty response)')
        }

        // Accept either { from: 'E2', to: 'E4' } or { 'E2': 'E4' }
        const parsed = parseAiMove(aiMove)
        if (!parsed) {
            return await handleAiFailure('AI move failed (invalid response shape)')
        }

        return await performMove(parsed.from, parsed.to)
    }

    async function getMoves (boardOverride) {
        const moves = await sendRequest(API_URIS.MOVES, boardOverride ? { board: boardOverride } : undefined)
        if (!moves) {
            return
        }

        const baseBoard = boardOverride || chess
        if (isMovesEmpty(moves)) {
            setChess(Object.assign({}, baseBoard, {
                moves: {},
                isFinished: true,
                checkMate: !!baseBoard.check,
                staleMate: !baseBoard.check,
            }))
        } else {
            setChess(Object.assign({}, baseBoard, { moves }))
        }
    }

    async function handleNewGameClick() {
        const resetBoard = Object.assign({}, NEW_GAME_BOARD_CONFIG, {
            history: [],
            moves: {},
            move: {},
            isFinished: false,
            checkMate: false,
            staleMate: false,
            check: false,
            enPassant: null,
        })

        setChess(resetBoard)
        await getMoves(resetBoard)
    }

    function isMovesEmpty(moves) {
        return !moves || (typeof moves === 'object' && Object.keys(moves).length === 0)
    }

    function appendHistory(record) {
        setChess(prev => Object.assign({}, prev, {
            history: [...(prev.history || []), record]
        }))
    }

    function setFinished(checkMate) {
        setChess(prev => Object.assign({}, prev, {
            moves: {},
            move: {},
            isFinished: true,
            checkMate: !!checkMate,
        }))
    }

    async function handleAiFailure(message) {
        appendHistory({ from: 'Error', to: message })

        // Try to determine whether the side to move has any legal moves.
        // If there are no moves, treat it as game end (checkmate/stalemate).
        const moves = await sendRequest(API_URIS.MOVES)
        if (moves && isMovesEmpty(moves)) {
            setFinished(!!chess.check)
        }
    }

    function parseAiMove(aiMove) {
        if (!aiMove || typeof aiMove !== 'object') return null

        if (aiMove.from && aiMove.to) {
            return { from: aiMove.from, to: aiMove.to }
        }

        const keys = Object.keys(aiMove)
        if (keys.length !== 1) return null
        const from = keys[0]
        const to = aiMove[from]
        if (!from || !to) return null
        return { from, to }
    }

    async function sendRequest(endpoint, extraBody) {
        await setLoading(true)
        try {
            const res = await fetch(`${process.env.REACT_APP_JS_CHESS_API}${endpoint}`,
                {
                    method: 'POST',
                    body: JSON.stringify(
                        Object.assign(
                            {},
                            extraBody || {},
                            // allow callers to supply an explicit board; otherwise use current state
                            { board: (extraBody && Object.prototype.hasOwnProperty.call(extraBody, 'board')) ? extraBody.board : chess }
                        )
                    ),
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            if (res.status !== 200) {
                throw new Error(`Server returns ${res.status}`)
            }
            await setLoading(false)
            const json = await res.json()
            return unwrapServerResponse(endpoint, json)
        } catch (error) {
            await setLoading(false)
            appendHistory({ from: 'Error', to: error.message })
            return null
        }
    }

    function unwrapServerResponse(endpoint, json) {
        // Support both "raw" and "enveloped" server responses.
        // Recommended v2 server shapes:
        // - /moves    -> { moves: MovesMap }
        // - /status   -> { status: BoardConfig }
        // - /move     -> { board: BoardConfig }
        // - /ai-move  -> { move: HistoryEntry }
        if (!json || typeof json !== 'object') return json

        if (endpoint === API_URIS.MOVES) return json.moves || json
        if (endpoint === API_URIS.STATUS) return json.status || json
        if (endpoint === API_URIS.MOVE) return json.board || json
        if (endpoint === API_URIS.AI_MOVE) return json.move || json
        return json
    }

    async function handleChangeComputerLevelClick(level) {
        await setSettings(Object.assign({}, settings, {computerLevel: level}))
    }

    async function handleChangeConfirmationToggleClick() {
        await setSettings(Object.assign({}, settings,{confirmation: settings.confirmation ? false : true}))
    }

    async function handleChangeSoundToggleClick() {
        await setSettings(Object.assign({}, settings,{sound: settings.sound ? false : true}))
    }

    async function handleChangeConfirmationClick() {
        return performMove(chess.move.from, chess.move.to)
    }
}

export default App
