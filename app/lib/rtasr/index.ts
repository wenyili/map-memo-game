import CryptoJS from 'crypto-js';
import { Dispatch, SetStateAction } from 'react';

// 请求地址根据语种不同变化
const url = process.env.XFYUN_RTASR_URL;
const appId = process.env.XFYUN_APPID!;
const secretKey = process.env.XFYUN_RTASR_SECRET_KEY!;

enum WebSocketReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}

export class WebSocketHelper {
    private static instance: WebSocketHelper;
    private asrWS: WebSocket | undefined;

    private constructor(private setConnected: Dispatch<SetStateAction<boolean>>) {
    }

    static getInstance(setConnected: Dispatch<SetStateAction<boolean>>) {
        if (!WebSocketHelper.instance) {
            WebSocketHelper.instance = new WebSocketHelper(setConnected);
        }

        return WebSocketHelper.instance;
    }

    async connect() {
        if (this.asrWS?.readyState === WebSocket.OPEN) {
            return WebSocketHelper.instance;
        }

        const response = await fetch("/api/xfyun", {
            method: "POST",
        });
        const data = await response.json();
        if (response.status !== 200) {
            alert(data.error)
            return
        }

        const websocketUrl = data.result;
        if ("WebSocket" in window) {
            this.asrWS = new WebSocket(websocketUrl);
        } else {
            alert("浏览器不支持WebSocket");
            return; 
        }
        this.asrWS.onopen = (e: Event) => {
            console.log("websocket open")
            this.setConnected(true)
        };
        this.asrWS.onmessage = (e: MessageEvent) => {
            console.log("websocket open")
        };
        this.asrWS.onerror = (e: Event) => {
            console.log("websocket error")
        };
        this.asrWS.onclose = (e: CloseEvent) => {
            console.log("websocket close")
            this.setConnected(false)
        };
    }

    disconnect() {
        this.asrWS?.close();
    }

    get isConnected(): boolean {
        return this.asrWS !== undefined && this.asrWS.readyState === this.asrWS.CONNECTING;
    }
}