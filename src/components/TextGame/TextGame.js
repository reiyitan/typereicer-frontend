import React from "react";
import { useState, useEffect, useRef } from "react"; 
import { useGame } from "../../ContextProviders";
import "./TextGame.css";

const refreshIcon = ( 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" id="refresh-icon">
        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
    </svg>
);

const Char = ({char, charIndex, thisWordIndex}) => {
    const { words, currWordIndex, currCharIndex, typedWords, setPrevCharRef, setCurrCharRef } = useGame();
    const isPrevChar = currWordIndex === thisWordIndex && currCharIndex - 1 === charIndex;
    const isCurrChar = currWordIndex === thisWordIndex && currCharIndex === 0 && charIndex === 0;
    return (
        <span
            id={`word-${thisWordIndex}-${charIndex}`}
            className={
                typedWords[thisWordIndex].length <= charIndex
                    ? "unattempted"
                    : charIndex >= words[thisWordIndex].length
                    ? "extra"
                    : typedWords[thisWordIndex][charIndex] !== words[thisWordIndex][charIndex]
                    ? "incorrect"
                    : "correct"
            }
            ref={el => {
                if (isPrevChar) setPrevCharRef(el);
                else if (isCurrChar) setCurrCharRef(el);
            }}
        >
            {char}
        </span>
    );
}

const Word = ({thisWord, thisWordIndex}) => {
    return (
        <span className="word">
            {
                thisWord.split("").map((char, charIndex) => (
                    <Char
                        char={char}
                        charIndex={charIndex}
                        thisWordIndex={thisWordIndex}
                        key={charIndex}
                    />
                ))
            }
        </span>
    );
}

export const TextGame = () => {
    const {
        words,
        typedWords, setTypedWords,
        numWords, setNumWords,
        fetchWords,
        currWordIndex, setCurrWordIndex,
        currCharIndex, setCurrCharIndex,
        indexArray,
        prevCharRef, currCharRef,
        gameRunning, setGameRunning,
        handleGameEnd
    } = useGame();

    const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });
    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const controlsRef = useRef(null);

    useEffect(() => {
        fetchWords();
    }, []);

    useEffect(() => {
        const charElement = (currCharIndex === 0) ? currCharRef : prevCharRef;
        const container = containerRef.current; 
        if (charElement && container) {
            const charRect = charElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const newLeft = () => {
                if (currCharIndex === 0) return `${charRect.left - containerRect.left - 1.7}px`;
                else return `${charRect.right - containerRect.left - 1.7}px`;
            }
            const newBottom = () => `${containerRect.bottom - charRect.bottom + 2}px`;
            setCursorPosition({
                left: newLeft(),
                bottom: newBottom()
            });
        }
    }, [prevCharRef, currCharRef, numWords])

    const handleKeyDown = (e) => {
        if (!gameRunning) return;
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
            if (typedWords[currWordIndex] === "") return;
            setCurrWordIndex(prevIndex => prevIndex + 1);
            setCurrCharIndex(0);
        }
        else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90)) {
            if (currWordIndex >= numWords) {
                handleGameEnd();
                return;
            }
            if (typedWords[currWordIndex].length > words[currWordIndex].length + 5) return;
            if (!gameRunning) setGameRunning(true);
            const newTypedWords = [...typedWords]; 
            newTypedWords[currWordIndex] += e.key; 
            setTypedWords(newTypedWords);
            setCurrCharIndex(prevIndex => prevIndex + 1);
        }
    }

    const [blurred, setBlurred] = useState(true);
    const documentRef = useRef(document);
    useEffect(() => {
        const handleClick = (event) => {
            if (
                !containerRef.current.contains(event.target) 
                && !buttonRef.current.contains(event.target) 
                && !controlsRef.current.contains(event.target)
            ) setBlurred(true);
            else if (inputRef.current) inputRef.current.focus();
        }
        const currentDocument = documentRef.current
        currentDocument.addEventListener("click", handleClick, true);
        return () => {
            currentDocument.removeEventListener("click", handleClick, true);
        };
    }, []); 

    const inputRef = useRef(null); 
    const handleOverlayClick = () => {
        setBlurred(false);
        setGameRunning(true);
        if (inputRef.current) inputRef.current.focus();
    }

    const handleWordNumSwitch = (newNumWords) => {
        setNumWords(newNumWords);
    }

    return (
        <div id="game-container">
            <div id="game-controls" className="shadow" ref={controlsRef}>
                <button
                    className={`word-count-button word-count-button-25 ${numWords === 25 ? "word-count-button-active" : ""}`}
                    onClick={() => handleWordNumSwitch(25)}
                >
                    25
                </button>
                <button
                    className={`word-count-button word-count-button-50 ${numWords === 50 ? "word-count-button-active" : ""}`}
                    onClick={() => handleWordNumSwitch(50)}
                >
                    50
                </button>
            </div>
            <input 
                autoComplete="false"
                id="game-input"
                onPaste={(e) => e.preventDefault()}
                onKeyDown={handleKeyDown}
                type="text"
                ref={inputRef}
            />
            <div
                id="words-div"
                className="shadow"
                ref={containerRef}
            >
                {
                    indexArray.length <= words.length &&
                    <div
                        id="words-div-overlay"
                        className={blurred ? "" : "hidden"}
                        onClick={handleOverlayClick}
                    >
                        <span id="focus-message">Click here to focus</span>
                    </div>
                }
                {
                    indexArray.length <= words.length 
                    ? (indexArray.map((index) => (
                         <Word 
                            thisWord={words[index] + typedWords[index].substring(words[index].length)} 
                            thisWordIndex={index}
                            key={index}
                        />
                    )))
                    : <div id="loading-words-div"><span id="loading-words-msg">Loading words...</span></div>
                }
                <div
                    className="cursor"
                    style={{ left: cursorPosition.left, bottom: cursorPosition.bottom }}
                />
            </div>
            <button 
                id="refresh-button"
                className="shadow"
                onClick={fetchWords}
                ref={buttonRef}
            >
                {refreshIcon}
            </button>
        </div>
    )
}