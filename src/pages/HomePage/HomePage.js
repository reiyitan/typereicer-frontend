import React from "react"; 
import "./HomePage.css";
import { TextGame } from "../../components";
import { GameProvider } from "../../ContextProviders";

export const HomePage = () => {
    return (
        <>
            <GameProvider>
                <TextGame />
            </GameProvider>
        </>
    );
}