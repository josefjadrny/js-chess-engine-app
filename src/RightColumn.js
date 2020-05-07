import React from 'react';
import {COMPUTER_LEVELS} from './const/board'

function RightColumn(props) {
    const {
        onNewGameClick,
        onComputerLevelClick,
        chess,
        settings,
    } = props

    return (
        <div>
            <button disabled={!chess.history.length} onClick={onNewGameClick}><b>NEW GAME</b></button>
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
        </div>
    )
}

export default RightColumn
