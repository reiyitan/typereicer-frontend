import React from "react"; 
import { useState, createContext, useContext, useEffect } from "react"; 

const GameContext = createContext();
export const GameProvider = ({children}) => {
    const [words, setWords] = useState(new Array(50).fill("")); 
    const [typedWords, setTypedWords] = useState(new Array(50).fill("")); 
    const [numWords, setNumWords] = useState(50);
    const [currWordIndex, setCurrWordIndex] = useState(0); 
    const [currCharIndex, setCurrCharIndex] = useState(0);
    const [indexArray, setIndexArray] = useState(Array.from({ length: 50 }, (_, index) => index)); 
    const [prevCharRef, setPrevCharRef] = useState(null);
    const [currCharRef, setCurrCharRef] = useState(null);

    useEffect(() => {
        setIndexArray(Array.from({ length: numWords }, (_, index) => index));
    }, [numWords]); 

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
                currCharRef, setCurrCharRef
            }}
        >
            {children}
        </GameContext.Provider>
    )
} 
export const useGame = () => useContext(GameContext);