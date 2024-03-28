import { useRef, useState } from "react";
import countries from "../assets/country_data.json"

async function judge(question: string, answer:string) {
    try {
        const response = await fetch("/api/openai", {
            method: "POST",
            body: JSON.stringify({
            question,
            answer,
            modelName: "gpt-4",
            }),
        })
        const data = await response.json();
        return data.content === "正确"
    } catch (error) {
        console.error("Error:", error);
        alert(error)
    }
}

export function useCountries() {
    const index = useRef<number>(0);
    const [country, setCountry] = useState<string>(countries[index.current]["name_zh"]);
    const [map, setMap] = useState<string>(countries[index.current]["outline_picture"]);
    const [right, setRight] = useState<boolean>(false);
    const [lastText, setLastText] = useState<string>("");
    
    const onGuess = async (guess: string) => {
        const country = countries[index.current]["name_zh"];
        setLastText(guess)
        const useGPT = localStorage.getItem("useGPT")
        let isTrue = false;
        if (useGPT == "true") {
            isTrue = await judge(country, guess) || false
        } else {
            isTrue = guess.includes(country)
        }
        console.debug(`guess: ${guess} ${country} ${isTrue} ${useGPT}`)
        if (isTrue) {
            setRight(true)
            index.current = (index.current + 1) % countries.length;
            const nextCountry = countries[index.current]["name_zh"]
            const nextMap = countries[index.current]["outline_picture"]
            const nextIamge = new Image()
            nextIamge.src = nextMap
            setTimeout(() => {
                setCountry(nextCountry)
                setMap(nextMap)
                setRight(false)
                setLastText("")
            }, 300);
        }
    }
    return {country, map, onGuess, right, lastText}
}