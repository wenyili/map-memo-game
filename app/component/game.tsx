'use client'

import { Button } from "../ui/button"
import { useRecorder } from "../lib/useRecorder"
import { useCountries } from "../lib/useCountries";
import { Menu } from "./menu";
import { useCallback, useEffect, useRef, useState } from "react";
import classNames from 'classnames'

const debug = true;

export default function Game() {
    const { country, map, onGuess, right, lastText, next } = useCountries()
    const { recording, startRecoding, stopRecording, showText } = useRecorder(onGuess);
    const [ showMenu, setShowMenu ] = useState<boolean>(false)
    const [ buttonText, setButtonText ] = useState<string>("Start Recording")
    const [ hint, setHint ] = useState<string>("Hint")
    const audioRef = useRef<HTMLAudioElement|null>(null)

    useEffect(() => {
        if (!audioRef.current) return;
        if (right === 1) {
            audioRef.current.src = "correct.mp3"
            audioRef.current.play()
        } else if (right === 2) {
            audioRef.current.src = "wrong.mp3"
            audioRef.current.play()
        }
    }, [right])

    const onClick = () => {
        if (recording === "RECORDING") {
            stopRecording()
        } else if (recording === "CLOSED") {
            startRecoding()
        }
    }

    const getButtonText = useCallback(() => {
        if (recording === "CLOSED") {
            return "Start Recording"   
        } else {
            return recording;
        }
    }, [recording])

    useEffect(() => {
        setButtonText(getButtonText());
    }, [getButtonText, recording])

    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <img className="max-w-[80%] max-h-[80%]" src={map} alt={country}/>
                <div className={classNames("absolute flex items-center justify-center text-yellow-500 text-5xl md:text-7xl font-bold", {
                    "animate-heartBeat": right === 1,
                    "animate-wobble": right === 2,
                })}>
                    {lastText}
                </div>
            </div>
            <Menu isOpen={showMenu} onOpenChange={(isOpen:boolean) => {setShowMenu(isOpen)}}/>
            <Button 
                className={classNames("fixed bottom-0 right-0 w-40 m-6 p-2 bg-gray-200 hover:bg-gray-500 text-gray-800 font-bold rounded inline-flex items-center", {"animate-bounce": recording === "CLOSED"})}
                disabled={recording !== "RECORDING" && recording !== "CLOSED"}
                onClick={onClick}
                onMouseEnter={() => {recording === "RECORDING" && setButtonText("Stop Recording")}}
                onMouseLeave={() => {setButtonText(getButtonText())}}
            >
                {recording === "RECORDING" && (<span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>)}
                <span className={classNames({"ml-2": recording === "RECORDING"})}>{buttonText}</span>
            </Button>
            <div className="flex flex-row items-center justify-center fixed bottom-0 left-0 m-6 gap-2">
                <div className="h-8 p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded inline-flex items-center justify-center" 
                    onMouseEnter={() => setHint(country!)}
                    onMouseLeave={() => setHint("Hint")}>
                    {hint}
                </div>
                <Button className="h-8 p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded inline-flex items-center justify-center"
                    onClick={() => next()}>
                    Next
                </Button>
            </div>
            <audio ref={audioRef} style={{ display: 'none' }} />
        </>
    )

}