import { useRef, useState } from "react";
import RecorderManager from './recorder';

const getWebSocketUrl = async () => {
    const response = await fetch("/api/xfyun", {
        method: "POST",
    });
    const data = await response.json();
    if (response.status !== 200) {
        alert(data.error)
        return
    }
    return data.result;
}

export function useRecorder(onGuess: (guess: string) => void) {
    const [recording, setRecording] = useState<"CONNECTING" | "STARTING" | "RECORDING" | "CLOSING" | "CLOSED">("CLOSED")
    const [showText, setShowText] = useState<string>('')
    const [lastText, setLastText] = useState<string>('')
    const asrWS = useRef<WebSocket | undefined>()
    const resultText = useRef<string>('')
    const recorder = useRef<RecorderManager | undefined>()

    recorder.current = new RecorderManager('./recorder');
    recorder.current.onStart = () => {
        console.debug("recording...")
        setRecording("RECORDING")
    }
    recorder.current.onStop = () => {
        console.debug("...stop recording")
    }
    recorder.current.onFrameRecorded = ({ isLastFrame, frameBuffer }) => {
        sendData(isLastFrame, frameBuffer)
    };

    const sendData = (isLastFrame: boolean, frameBuffer: ArrayBuffer) => {
        if (asrWS.current === undefined) return;
        if (asrWS.current.readyState === asrWS.current.OPEN) {
            asrWS.current.send(new Int8Array(frameBuffer));
            if (isLastFrame) {
                console.debug("...last frame")
                asrWS.current.send('{"end": true}');
                setRecording("CLOSING")
            }
        }
    }

    const renderResult = (resultData: string) => {
        const jsonData = JSON.parse(resultData);
        if (jsonData.action == "started") {
            console.debug("握手成功");
        } else if (jsonData.action == "result") {
            const data = JSON.parse(jsonData.data)
            let resultTextTemp = ""
            data.cn.st.rt.forEach((j:any) => {
                j.ws.forEach((k:any) => {
                    k.cw.forEach((l:any) => {
                        resultTextTemp += l.w;
                    });
                });
            });
            
            setShowText(resultText.current + resultTextTemp);
            if (data.cn.st.type == 0) {
                // 【最终】识别结果：
                // console.debug(resultTextTemp)
                onGuess(resultTextTemp)
                setLastText(resultTextTemp)
                resultText.current += resultTextTemp;
            }
        } else if (jsonData.action == "error") {
            console.debug("出错了:", jsonData);
        }
    }

    const startRecoding = async () => {
        resultText.current = ""
        setShowText("")

        const websocketUrl = await getWebSocketUrl()
        if (!websocketUrl) return

        let ws;
        if ("WebSocket" in window) {
            ws = new WebSocket(websocketUrl);
            asrWS.current = ws;
        } else {
            alert("浏览器不支持WebSocket");
            return; 
        }
        setRecording("CONNECTING")

        ws.onopen = (e: Event) => {
            console.debug("websocket open")
            setRecording("STARTING")
            recorder.current?.start({
                sampleRate: 16000,
                frameSize: 1280,
            });
        };
        ws.onmessage = (e: MessageEvent) => {
            renderResult(e.data);
        };
        ws.onerror = (e: Event) => {
            console.debug("websocket error")
            setRecording("CLOSED")
            recorder.current?.stop();
        };
        ws.onclose = (e: CloseEvent) => {
            console.debug("websocket close")
            setRecording("CLOSED")
            recorder.current?.stop();
        };
    }

    const stopRecording = () => {
        asrWS.current?.close();
    }

    return {recording, startRecoding, stopRecording, showText, lastText}
}