import React, { useEffect } from 'react'
import { set } from 'local-storage'
import { PERSIST_STATE_NAMESPACE } from './const/board'

function PersistState(props) {
    const {
        settings,
        chess,
    } = props

    useEffect(() => {
        set(`${PERSIST_STATE_NAMESPACE}_settings`, settings)
    }, [settings]);

    useEffect(() => {
        set(`${PERSIST_STATE_NAMESPACE}_chess`, chess)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chess.turn]);

    return (
        <div>
        </div>
    )
}

export default PersistState
