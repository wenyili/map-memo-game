'use client'

import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { WebSocketHelper } from "../lib/rtasr"

export default function Rtasr() {
    const [websocket, setWebsocket] = useState<WebSocketHelper>()
    const [connected, setConnected] = useState<boolean>(false)

    useEffect(() => {
        const websocket = WebSocketHelper.getInstance(setConnected);
        setWebsocket(websocket)
    }, [])

    const onClick =() => {
        if (!websocket) return
        if (connected) {
            websocket.disconnect()
        } else {
            websocket.connect()
        }
    }

    return (
        <>
            <Button 
                className="mt-4 rounded-md bg-blue-400 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-300"
                disabled={websocket == undefined}
                onClick={onClick}>
                {connected ? "DISCONNECT" : "CONNECT"}
            </Button>
        </>
    )

}