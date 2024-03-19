import { Dispatch, SetStateAction } from 'react';
import RecorderManager from './recorder';

export class WebSocketHelper {
    private static instance: WebSocketHelper;
    private asrWS: WebSocket | undefined;
    private recorder: RecorderManager;
    public resultText: string = '';

    private constructor(private setShowText: Dispatch<SetStateAction<string>>, private setConnected: Dispatch<SetStateAction<boolean>>) {
        this.recorder = new RecorderManager('./recorder');
        this.recorder.onStart = () => {
            console.log("recording...")
        }
        this.recorder.onStop = () => {
            console.log("...stop recording")
        }
        this.recorder.onFrameRecorded = ({ isLastFrame, frameBuffer }) => {
            if (this.asrWS === undefined) return;
            if (this.asrWS.readyState === this.asrWS.OPEN) {
                this.asrWS.send(new Int8Array(frameBuffer));
                if (isLastFrame) {
                    console.log("...last frame")
                    this.asrWS.send('{"end": true}');
                }
            }
        };
    }

    static getInstance(setShowText: Dispatch<SetStateAction<string>>, setConnected: Dispatch<SetStateAction<boolean>>) {
        if (!WebSocketHelper.instance) {
            WebSocketHelper.instance = new WebSocketHelper(setShowText, setConnected);
        }
        return WebSocketHelper.instance;
    }

    renderResult(resultData: string) {
        const jsonData = JSON.parse(resultData);
        if (jsonData.action == "started") {
            // 握手成功
            console.log("握手成功");
        } else if (jsonData.action == "result") {
            const data = JSON.parse(jsonData.data)
            console.log(data)
            // 转写结果
            let resultTextTemp = ""
            data.cn.st.rt.forEach((j:any) => {
                j.ws.forEach((k:any) => {
                    k.cw.forEach((l:any) => {
                        resultTextTemp += l.w;
                    });
                });
            });
            if (data.cn.st.type == 0) {
                // 【最终】识别结果：
                this.resultText += resultTextTemp;
                resultTextTemp = ""
            }
        
            this.setShowText(this.resultText + resultTextTemp);
            // document.getElementById("result").innerText = resultText + resultTextTemp
        } else if (jsonData.action == "error") {
            // 连接发生错误
            console.log("出错了:", jsonData);
        }
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
            this.recorder.start({
              sampleRate: 16000,
              frameSize: 1280,
            });
        };
        this.asrWS.onmessage = (e: MessageEvent) => {
            console.log("websocket message")
            this.renderResult(e.data);
        };
        this.asrWS.onerror = (e: Event) => {
            console.log("websocket error")
            this.recorder.stop();
        };
        this.asrWS.onclose = (e: CloseEvent) => {
            console.log("websocket close")
            this.setConnected(false)
            this.recorder.stop();
        };
    }

    disconnect() {
        this.asrWS?.close();
    }

    get isConnected(): boolean {
        return this.asrWS !== undefined && this.asrWS.readyState === this.asrWS.CONNECTING;
    }
}