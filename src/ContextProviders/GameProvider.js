import React from "react"; 
import { useState, createContext, useContext, useEffect } from "react"; 

const defaultNumWords = 50; 
const GameContext = createContext();
export const GameProvider = ({children}) => {
    const [words, setWords] = useState(new Array(defaultNumWords).fill("")); 
    const [typedWords, setTypedWords] = useState(new Array(defaultNumWords).fill("")); 
    const [numWords, setNumWords] = useState(defaultNumWords);
    const [currWordIndex, setCurrWordIndex] = useState(0); 
    const [currCharIndex, setCurrCharIndex] = useState(0);
    const [indexArray, setIndexArray] = useState(Array.from({ length: defaultNumWords }, (_, index) => index)); 
    const [prevCharRef, setPrevCharRef] = useState(null);
    const [currCharRef, setCurrCharRef] = useState(null);
    const [gameFocused, setGameFocused] = useState(null);
    const [timerRunning, setTimerRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);

    const handleGameEnd = () => {
        setTimerRunning(false);
        console.log("game end");
    }

    useEffect(() => {
        let interval = null;
        const startTime = Date.now();
        if (timerRunning) {
            interval = setInterval(() => {
                const currentTime = Date.now();
                const elapsedTime = (currentTime - startTime) / 1000;
                setSeconds(elapsedTime);
            }, 10);
        } else if (!timerRunning && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerRunning]);

    useEffect(() => {
        setIndexArray(Array.from({ length: numWords }, (_, index) => index));
    }, [numWords]); 

    useEffect(() => {
        fetchWords()
    }, [indexArray]);

    const fetchWords = () => {
        setCurrWordIndex(0);
        fetch(`http://localhost:4000/words/get_words?num_words=${numWords}`)
        .then(res => res.json())
        .then(data => {
            setWords(data.words);
            setTypedWords(new Array(data.words.length).fill(""));
            setCurrWordIndex(0); 
            setCurrCharIndex(0); 
            setPrevCharRef(null);
            setCurrCharRef(null);
            setTimerRunning(false); 
            setSeconds(0);
        })
        .catch(error => console.error(error));
    }

    const handleKeyDown = (e) => {
        if (!gameFocused) return;
        if (e.ctrlKey && e.key === "Backspace") {
            const newTypedWords = [...typedWords]; 
            newTypedWords[currWordIndex] = ""; 
            setTypedWords(newTypedWords);
            setCurrCharIndex(0);
        }
        else if (e.key === "Backspace") {
            const targetWord = typedWords[currWordIndex]; 
            const newTypedWord = targetWord.substring(0, targetWord.length - 1); 
            const newTypedWords = [...typedWords]; 
            newTypedWords[currWordIndex] = newTypedWord; 
            setTypedWords(newTypedWords); 
            setCurrCharIndex(prevIndex => Math.max(0, prevIndex - 1));
        }
        else if (e.key === " " ) {
            if (currWordIndex === numWords - 1) {
                handleGameEnd();
                return;
            }
            if (typedWords[currWordIndex] === "") return;
            setCurrWordIndex(prevIndex => prevIndex + 1);
            setCurrCharIndex(0);
        }
        else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90)) {
            if (!timerRunning && currWordIndex === 0 && currCharIndex === 0) setTimerRunning(true);
            if (typedWords[currWordIndex].length > words[currWordIndex].length + 5) return;
            if (!gameFocused) setGameFocused(true);
            const newTypedWords = [...typedWords]; 
            newTypedWords[currWordIndex] += e.key; 
            setTypedWords(newTypedWords);
            setCurrCharIndex(prevIndex => prevIndex + 1);
            if (currWordIndex === numWords - 1 && newTypedWords[currWordIndex] === words[currWordIndex]) {
                handleGameEnd(); 
                return;
            }
        }
    }

    return (
        <GameContext.Provider
            value={{
                words, setWords,
                typedWords, setTypedWords,
                numWords, setNumWords, 
                fetchWords,
                currWordIndex, setCurrWordIndex,
                currCharIndex, setCurrCharIndex,
                indexArray,
                prevCharRef, setPrevCharRef,
                currCharRef, setCurrCharRef,
                gameFocused, setGameFocused,
                handleKeyDown,
                handleGameEnd,
                timerRunning, setTimerRunning, 
                seconds, setSeconds
            }}
        >
            {children}
        </GameContext.Provider>
    )
} 
export const useGame = () => useContext(GameContext);