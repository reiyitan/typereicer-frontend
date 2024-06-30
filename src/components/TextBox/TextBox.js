import React from "react";
import { useState, useEffect } from "react"; 
import "./TextBox.css";

export const TextBox = () => {
    const [words, setWords] = useState(""); 
    const [numWords, setNumWords] = useState(20);
    useEffect(() => {
        fetchWords(numWords, setWords);
    }, []);

    return (
        <>
            <button
                id="generate-words-button"
                onClick={() => fetchWords(numWords, setWords)}
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

const fetchWords = (numWords, setWords) => {
    fetch("http://127.0.0.1:4000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: "tanreiyi@gmail.com", 
            password: "testing"
        })
    })
    .then(res => res.json())
    .then(data => console.log(data)) 
    .catch(error => console.error(error))
}