import { useRef, useState } from "react";
import countries from "../assets/country_data.json"

// preload next 3 images
function* getNextIndex(random:boolean = false): Generator<number>  {
    const total = countries.length
    let numArr: number[]
    if (random) {
        numArr = [Math.floor(Math.random() * total), Math.floor(Math.random() * total), Math.floor(Math.random() * total)];
    } else {
        numArr = [0, 1, 2];
    }

    if (typeof window !== 'undefined') {
        for(let i = 0; i < 3; i++) {
            const nextMap = countries[i]["outline_picture"]
            const nextIamge = new Image()
            nextIamge.src = nextMap
        }
    }

    while(true) {
        let newNum: number 
        if (random) {
            newNum = Math.floor(Math.random() * total)
        } else {
            newNum = numArr[numArr.length - 1] + 1
        }
        numArr.push(newNum);
        if (typeof window !== 'undefined') {
            const nextMap = countries[newNum]["outline_picture"]
            const nextIamge = new Image()
            nextIamge.src = nextMap
        }
        yield numArr.shift() || 0;
    }
}
const gen = getNextIndex();

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
    const index = useRef<number | undefined>();
    if (index.current === undefined) {
        index.current = gen.next().value
    }
    const [country, setCountry] = useState<string>(countries[index.current!]["name_zh"]);
    const [map, setMap] = useState<string>(countries[index.current!]["outline_picture"]);
    const [right, setRight] = useState<boolean>(false);
    const [lastText, setLastText] = useState<string>("");
    
    const onGuess = async (guess: string) => {
        const country = countries[index.current!]["name_zh"];
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
            index.current = gen.next().value;
            const nextCountry = countries[index.current!]["name_zh"]
            const nextMap = countries[index.current!]["outline_picture"]

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