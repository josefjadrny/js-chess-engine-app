import React, { useEffect, useState } from 'react';
import {COMPUTER_LEVELS} from './const/board'

function RightColumn(props) {
    const {
        onNewGameClick,
        onComputerLevelClick,
        onConfirmationToggleClick,
        onSoundToggleClick,
        onConfirmationClick,
        chess,
        settings,
        loading,
    } = props

    const [engineVersion, setEngineVersion] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function loadVersion() {
            const base = process.env.REACT_APP_JS_CHESS_API
            if (!base) return

            try {
                const res = await fetch(`${base}version`)
                if (!res.ok) return
                const json = await res.json().catch(() => null)
                const version = json && (json.version || (json.jsChessEngine && json.jsChessEngine.version))
                if (!cancelled && version) setEngineVersion(version)
            } catch (e) {
                // ignore
            }
        }

        loadVersion()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <div>
            <div id="new_game">
                <button disabled={!chess.history.length || loading} onClick={onNewGameClick}><b>NEW GAME</b></button>
            </div>
            <div id="history">
                <b>HISTORY</b><br/>
                {chess.history.map(record => {
                    return ` ${record.from}-${record.to} `
                })}
            </div>
            <div id="level">
                <p><strong>Computer level</strong></p>
                {Object.keys(COMPUTER_LEVELS).map(level => {
                    return <label className="level_wrapper" key={level}>{level}
                            <input type="radio"
                                   id={`level_${level}`}
                                   name="level"
                                   value={COMPUTER_LEVELS[level]}
                                   checked={settings.computerLevel === COMPUTER_LEVELS[level] ? 'checked' : ''}
                                   onChange={() => onComputerLevelClick(COMPUTER_LEVELS[level])}
                            />
                            <span className="checkmark"></span>
                            </label>
                })}
            </div>
            <div id="confirmation">
                <p><b>Move confirmation</b></p>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={settings.confirmation ? 'checked' : '' }
                        onChange={onConfirmationToggleClick}
                    />
                        <span className="slider round"></span>
                </label>
                {settings.confirmation ?
                    <p><button onClick={onConfirmationClick} disabled={!(chess.move.from && chess.move.to)}><b>&#10004;</b></button></p> :
                    ''
                }

            </div>
            <div id="sound">
                <p><b>Sounds</b></p>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={settings.sound ? 'checked' : '' }
                        onChange={onSoundToggleClick}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
            <div id="copyright">
                <p>
                    This web site is using an open-source
                    &nbsp;<a href="https://www.npmjs.com/package/js-chess-engine" target="_blank"  rel="noopener noreferrer">js-chess-engine</a>
                    {engineVersion ? ` v${engineVersion}` : ''}.
                </p>
            </div>
        </div>
    )
}

export default RightColumn
