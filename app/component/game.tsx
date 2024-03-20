'use client'

import { Button } from "../ui/button"
import { useRecorder } from "../lib/rtasr/useRecorder"
import { useCountries } from "../lib/useCountries";

export default function Game() {
    const { country, onGuess, right } = useCountries()
    const { recording, startRecoding, stopRecording, showText, lastText } = useRecorder(onGuess);

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
                className="mt-4 rounded-md bg-blue-400 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-300"
                disabled={recording !== "RECORDING" && recording !== "CLOSED"}
                onClick={onClick}>
                {getBtnStatus(recording)}
            </Button>
            <div className="p-10">
                <span className="p-10">{country}</span>
                {right && (<span>✅</span>)}
            </div>
            <div>{lastText}</div>
            <div>{showText}</div>
        </>
    )

}