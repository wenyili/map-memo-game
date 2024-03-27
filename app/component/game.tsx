'use client'

import { Button } from "../ui/button"
import { useRecorder } from "../lib/rtasr/useRecorder"
import { useCountries } from "../lib/useCountries";
import { Menu } from "./menu";
import { useState } from "react";

const debug = false;

export default function Game() {
    const { country, map, onGuess, right, lastText } = useCountries()
    const { recording, startRecoding, stopRecording, showText } = useRecorder(onGuess);
    const [ showMenu, setShowMenu ] = useState<boolean>(false)

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
            <div className="flex items-center justify-center h-screen">
                <img className="max-w-[80vh] max-h-[80vh]" src={map} alt={country}/>
                <div className="absolute flex items-center justify-center text-yellow-500 text-5xl font-bold">
                    {lastText}
                </div>
            </div>
            <Menu isOpen={showMenu} onOpenChange={(isOpen:boolean) => {setShowMenu(isOpen)}}/>
            <Button 
                className="fixed bottom-0 right-0 m-6 p-2 bg-gray-200 hover:bg-gray-500 text-gray-800 font-bold rounded inline-flex items-center"
                disabled={recording !== "RECORDING" && recording !== "CLOSED"}
                onClick={onClick}>
                {getBtnStatus(recording)}
            </Button>
            { debug && (<div className="fixed bottom-0 w-full bg-gray-400 text-white p-4">
                {showText}
            </div>)}
        </>
    )

}