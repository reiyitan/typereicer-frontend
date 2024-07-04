import React from "react"; 
import { useState, createContext, useContext } from "react"; 

const GameContext = createContext();
export const GameProvider = ({children}) => {
    const [words, setWords] = useState([]); 
    const [typedWords, setTypedWords] = useState([]); 
    const [numWords, setNumWords] = useState(50);
    const [wordIndex, setWordIndex] = useState(0); 

    return (
        <GameContext.Provider
            value={{
                words, setWords,
                typedWords, setTypedWords,
                numWords, setNumWords, 
                wordIndex, setWordIndex
            }}
        >
            {children}
        </GameContext.Provider>
    )
} 
export const useGame = () => useContext(GameContext);