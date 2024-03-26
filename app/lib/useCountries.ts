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
        const isTrue = await judge(country, guess)
        console.log(`guess: ${guess} ${country} ${isTrue}`)
        if (isTrue) {
            setRight(true)
            // setMap(countries[index.current]["outline_color_picture"])
            setTimeout(() => {
                index.current = (index.current + 1) % countries.length;
                setCountry(countries[index.current]["name_zh"])
                setMap(countries[index.current]["outline_picture"])
                setRight(false)
                setLastText("")
            }, 300);
        }
    }
    return {country, map, onGuess, right, lastText}
}