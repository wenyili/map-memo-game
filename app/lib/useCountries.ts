import { useRef, useState } from "react";
import countries from "../lib/countries.json"

export function useCountries() {
    const index = useRef<number>(0);
    const [country, setCountry] = useState<string>(countries[index.current]);
    const [right, setRight] = useState<boolean>(false);
    const [lastText, setLastText] = useState<string>("");
    
    const onGuess = (guess: string) => {
        const country = countries[index.current];
        setLastText(guess)
        console.log(`guess: ${guess} ${country}`)
        if (guess.includes(country)) {
            setRight(true)
            setTimeout(() => {
                index.current = (index.current + 1) % countries.length;
                setCountry(countries[index.current])
                setRight(false)
                setLastText("")
            }, 500);
        }
    }
    return {country, onGuess, right, lastText}
}