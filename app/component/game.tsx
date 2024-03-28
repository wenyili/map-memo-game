'use client'

import { Button } from "../ui/button"
import { useRecorder } from "../lib/useRecorder"
import { useCountries } from "../lib/useCountries";
import { Menu } from "./menu";
import { useEffect, useState } from "react";

const debug = false;

export default function Game() {
    const { country, map, onGuess, right, lastText } = useCountries()
    const { recording, startRecoding, stopRecording, showText } = useRecorder(onGuess);
    const [ showMenu, setShowMenu ] = useState<boolean>(false)
    const [ buttonText, setButtonText ] = useState<string>("Start Recording")

    const onClick = () => {
        if (recording === "RECORDING") {
            stopRecording()
        } else if (recording === "CLOSED") {
            startRecoding()
        }
    }

    const getBtnStatus = (status: "CONNECTING" | "STARTING" | "RECORDING" | "CLOSING" | "CLOSED") => {
        if (status === "CLOSED") {
            return "Start Recording";
        }
        return status;
    }

    const getButtonText = () => {
        if (recording === "CLOSED") {
            return "Start Recording"   
        } else {
            return recording;
        }
    }

    useEffect(() => {
        setButtonText(getButtonText());
    }, [recording])

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
                className="fixed bottom-0 right-0 w-40 m-6 p-2 bg-gray-200 hover:bg-gray-500 text-gray-800 font-bold rounded inline-flex items-center"
                disabled={recording !== "RECORDING" && recording !== "CLOSED"}
                onClick={onClick}
                onMouseEnter={() => {recording === "RECORDING" && setButtonText("Stop Recording")}}
                onMouseLeave={() => {setButtonText(getButtonText())}}
            >
                {recording === "RECORDING" && (<span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>)}
                <span className="ml-2">{buttonText}</span>
            </Button>
            { debug && (<div className="fixed bottom-0 w-full bg-gray-400 text-white p-4">
                {showText}
            </div>)}
        </>
    )

}