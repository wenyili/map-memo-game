'use client'
import { useState } from "react";
import { utils } from "../lib/vad-web";
import { useMicVAD } from "../lib/useMicVAD";
import { Button } from "../ui/button";

type AudioContent = {
    url: string;
    text: string;
}

export default function VAD() {
    const [audioList, setAudioList] = useState<AudioContent[]>([]);
    const [debugInfo, setDebugInfo] = useState<string>();

    const vad = useMicVAD({
        onSpeechEnd: async (audio) => {
            setDebugInfo(`detect ${audioList.length + 1}`)
            const wavBuffer = utils.encodeWAV(audio)
            const blob = new Blob([wavBuffer], {type: "video/wav"});
            const base64 = utils.arrayBufferToBase64(wavBuffer)
            const url = `data:audio/wav;base64,${base64}`

            try {
                const response = await fetch("/api/whisper", {
                    method: "POST",
                    body: blob,
                });
                const data = await response.json();
                if (response.status !== 200) {
                    console.error(data.error)
                    return
                }
                setAudioList((old) => {
                    return [...old, {
                        url,
                        text: data.result
                    }]
                })
            } catch (err) {
                console.error(err)
                alert(err)
            }
        },
    })

    return (
        <div>
            <div>{debugInfo}</div>
            <div className="flex space-x-4">
                <Button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400" disabled={!vad} onClick={() => vad.start()}>Start</Button>
                <Button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400" disabled={!vad} onClick={() => vad.pause()}>Pause</Button>
            </div>
            <div>
                {audioList.map((audio, index) => (
                    <div className="mt-4">
                        <audio key={index} controls src={audio.url}></audio>
                        <div>{audio.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}