import React from "react";
import { useState, useEffect } from "react"; 
import "./TextBox.css";

export const TextBox = () => {
    const [words, setWords] = useState(""); 
    const [numWords, setNumWords] = useState(20);
    useEffect(() => {
        fetchWords(numWords);
    }, []);

    return (
        <>
            <button
                id="generate-words-button"
                onClick={() => fetchWords(numWords)}
            >
                Generate New Challenge
            </button>

            <div
                id="words-div"
            >
                {words}
            </div>
        </>
    )
}

const fetchWords = (numWords) => {
    fetch(`http://127.0.0.1:8000/words/get_words/${numWords}/`)
        .then(res => res.json()) 
        .then(data => console.log(data))
        .catch(error => console.error(error));
}