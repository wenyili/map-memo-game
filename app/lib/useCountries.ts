import { useRef, useState } from "react";
import countries from "../lib/countries.json"

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
    const [country, setCountry] = useState<string>(countries[index.current]);
    const [right, setRight] = useState<boolean>(false);
    const [lastText, setLastText] = useState<string>("");
    
    const onGuess = async (guess: string) => {
        const country = countries[index.current];
        setLastText(guess)
        const isTrue = await judge(country, guess)
        console.log(`guess: ${guess} ${country} ${isTrue}`)
        if (isTrue) {
            setRight(true)
            setTimeout(() => {
                index.current = (index.current + 1) % countries.length;
                setCountry(countries[index.current])
                setRight(false)
                setLastText("")
            }, 300);
        }
    }
    return {country, onGuess, right, lastText}
}