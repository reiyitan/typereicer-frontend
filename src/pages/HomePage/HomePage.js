import React from "react"; 
import { useState } from "react"; 
import "./HomePage.css";
import { TextGame, LeaderboardPanel, ProfilePanel } from "../../components";
import { GameProvider } from "../../ContextProviders";

const typeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="view-icon" id="type-icon">
        <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
    </svg>
); 

const leaderboardIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="view-icon" id="leaderboard-icon">
        <path fillRule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 0 0-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 0 0-.552.698 5 5 0 0 0 4.503 5.152 6 6 0 0 0 2.946 1.822A6.451 6.451 0 0 1 7.768 13H7.5A1.5 1.5 0 0 0 6 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 0 0-1.5-1.5h-.268a6.453 6.453 0 0 1-.684-2.202 6 6 0 0 0 2.946-1.822 5 5 0 0 0 4.503-5.152.75.75 0 0 0-.552-.698A31.804 31.804 0 0 0 16 2.562v-.387a.75.75 0 0 0-.629-.74A33.227 33.227 0 0 0 10 1ZM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 0 1-1.855-2.68Zm14.95 0a3.503 3.503 0 0 1-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.099.988.21 1.475.332Z" clipRule="evenodd" />
    </svg>
);

const profileIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="view-icon" id="profile-icon">
        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
    </svg>
);

export const HomePage = () => {
    const [view, setView] = useState("type"); 
    return (
        <>
            <div id="view-selector-container">
                <button 
                    className={`view-selector-button shadow ${view === "type" ? "view-selector-button-active" : ""}`}
                    onClick={() => setView("type")}
                >
                    {typeIcon}
                </button>
                <button 
                    className={`view-selector-button shadow ${view === "leaderboard" ? "view-selector-button-active" : ""}`}
                    onClick={() => setView("leaderboard")}
                >
                    {leaderboardIcon}
                </button>
                <button 
                    className={`view-selector-button shadow ${view === "profile" ? "view-selector-button-active" : ""}`}
                    onClick={() => setView("profile")}
                >
                    {profileIcon}
                </button>
            </div>
            {
                view === "type"
                ? <GameProvider><TextGame /></GameProvider>
                : view === "leaderboard"
                ? <LeaderboardPanel />
                : <ProfilePanel />
            }
        </>
    );
}