'use client'

import { Button } from "../ui/button"
import { useRecorder } from "../lib/rtasr/useRecorder"
import { useCountries } from "../lib/useCountries";

export default function Game() {
    const { country, onGuess, right, lastText } = useCountries()
    const { recording, startRecoding, stopRecording, showText } = useRecorder(onGuess);

    const onClick = () => {
        if (recording === "RECORDING") {
            stopRecording()
        } else if (recording === "CLOSED") {
            startRecoding()
        }
    }

    const getBtnStatus = (status: "CONNECTING" | "STARTING" | "RECORDING" | "CLOSING" | "CLOSED") => {
        if (status === "RECORDING") {
            return "Stop Recording";
        } else if (status === "CLOSED") {
            return "Start Recording";
        }
        return status;
    }

    return (
        <>
            <Button 
                className="fixed top-0 w-full bg-gray-400 text-white transition-colors hover:bg-gray-300 rounded-none"
                disabled={recording !== "RECORDING" && recording !== "CLOSED"}
                onClick={onClick}>
                {getBtnStatus(recording)}
            </Button>
            <div className="p-20">
                <div>问题：{country}</div>
                <div>
                    <span>回答：{lastText}</span>
                    {right && <span>✅</span>}
                </div>
            </div>
            <div className="fixed bottom-0 w-full bg-gray-400 text-white p-4">
                {showText}
            </div>
        </>
    )

}