import React from 'react';

function RightColumn(props) {
    const {
        onClick,
        chess,
    } = props


    return (
        <div>
            <button disabled={!chess.history.length} onClick={onClick}><b>NEW GAME</b></button>
            <div className="history">
                <b>HISTORY</b><br />
                {chess.history.map(record => {
                    return ` ${record.from}-${record.to} `
                })}
            </div>
        </div>
    )
}

export default RightColumn
