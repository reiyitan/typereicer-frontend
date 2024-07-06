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
    const [gameRunning, setGameRunning] = useState(null);

    const handleGameEnd = () => {
        setGameRunning(false);
        console.log("game end");
    }



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
        })
        .catch(error => console.error(error));
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
                gameRunning, setGameRunning,
                handleGameEnd
            }}
        >
            {children}
        </GameContext.Provider>
    )
} 
export const useGame = () => useContext(GameContext);