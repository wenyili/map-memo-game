import { useEffect, useRef, useState } from "react";
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
            const nextIamge = new Image()
            nextIamge.src = './map/' + countries[i]["name"] + '.webp'
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
            const nextIamge = new Image()
            nextIamge.src = './map/' + countries[newNum]["name"] + '.webp'
        }
        yield numArr.shift() || 0;
    }
}
const gen = getNextIndex(true);

export function useCountries() {
    const index = useRef<number | undefined>();
    const [country, setCountry] = useState<string>();
    const [map, setMap] = useState<string>();
    const [right, setRight] = useState<number>(0);
    const [lastText, setLastText] = useState<string>("");

    useEffect(() => {
        if (index.current === undefined) {
            index.current = gen.next().value
            setCountry(countries[index.current!]["name_zh"])
            setMap('./map/' + countries[index.current!]["name"] + '.webp')
        }
    }, [])
    
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
            setRight(1)
            index.current = gen.next().value;
            console.debug('get next:', countries[index.current!]["name"])
            const nextCountry = countries[index.current!]["name_zh"]
            const nextMap = './map/' + countries[index.current!]["name"] + '.webp'

            setTimeout(() => {
                setCountry(nextCountry)
                setMap(nextMap)
                setLastText("")
                setRight(0)
            }, 300);
        } else {
            setRight(2)
            setTimeout(() => {
                setRight(0)
            }, 300);
        }
    }
    return {country, map, onGuess, right, lastText}
}