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

export function useCountries(initialCountry: string | undefined) {
    const index = useRef<number | undefined>();
    const [country, setCountry] = useState<string>();
    const [map, setMap] = useState<string>();
    const [right, setRight] = useState<number>(0);
    const [lastText, setLastText] = useState<string>("");
    const [lastCountry, setLastCountry] = useState<string>("");

    useEffect(() => {
        if (index.current === undefined) {
            // fine the index of initialCountry from countries
            console.log(initialCountry)
            if (initialCountry) {
                for (let i = 0; i < countries.length; i++) {
                    // 不关心大小写
                    if (countries[i]["name"].toLowerCase() === initialCountry.toLowerCase()) {
                        console.log(initialCountry, i)
                        index.current = i
                        break
                    }
                }
            }
            if (index.current === undefined) {
                index.current = gen.next().value
            }
            setCountry(countries[index.current!]["name_zh"])
            setMap('./map/' + countries[index.current!]["name"] + '.webp')
        }
    }, [initialCountry])

    const next = () => {
        index.current = gen.next().value;
        console.debug('get next:', countries[index.current!]["name"])
        const nextCountry = countries[index.current!]["name_zh"]
        const nextMap = './map/' + countries[index.current!]["name"] + '.webp'

        setCountry(nextCountry)
        setMap(nextMap)
        setLastText("")
        setLastCountry("")
        setRight(0)
    }

    const getGuessedCountry = (guess: string) => {
        // loop countries
        for (let i = 0; i < countries.length; i++) {
            if (guess.includes(countries[i]["name_zh"])) {
                return countries[i]["name_zh"]
            }
        }
        return ""
    }
    
    const onGuess = async (guess: string) => {
        const country = countries[index.current!]["name_zh"];
        setLastText(guess)
        const useGPT = localStorage.getItem("useGPT")
        let isTrue = guess.includes(country);
        if (!isTrue && useGPT == "true") {
            isTrue = await judge(country, guess) || false
        }
        console.debug(`guess: ${guess} ${country} ${isTrue} ${useGPT}`)
        if (isTrue) {
            setRight(1)
            setLastCountry(country)
            index.current = gen.next().value;
            const nextCountry = countries[index.current!]["name_zh"]
            const nextMap = './map/' + countries[index.current!]["name"] + '.webp'

            setTimeout(() => {
                setCountry(nextCountry)
                setMap(nextMap)
                setLastText("")
                setLastCountry("")
                setRight(0)
            }, 1000);
        } else {
            const guessedCountry = getGuessedCountry(guess)
            if (guessedCountry) {
                setRight(2)
                setLastCountry(guessedCountry)
                    setTimeout(() => {
                        setRight(0)
                        setLastText("")
                        setLastCountry("")
                    }, 1000);
            }
        }
    }
    return {country, map, onGuess, right, lastText, lastCountry, next}
}