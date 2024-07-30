import React from "react";
import { useEffect, useState } from "react";
import "./LeaderboardPanel.css"; 
import { useFirebase } from "../../ContextProviders";

const PlayerStanding = ({playerInfo, position, thisUsername}) => {
    return (
        <div className={playerInfo.username === thisUsername ? "this-player-standing" : "player-standing"}>
            <span>{position}.</span>
            <span>{playerInfo.username}</span>
            <span>{playerInfo.average_wpm.toFixed(2)}</span>
            <span>{playerInfo.average_acc.toFixed(2)}%</span>
        </div>
    )
}

export const LeaderboardPanel = () => {
    const { auth, get25_top10, get50_top10, get_overall_top10, get_user_info } = useFirebase();
    const [standings, setStandings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [thisUsername, setThisUsername] = useState("");
    const [mode, setMode] = useState("25");

    useEffect(() => {
        const getUsername = async () => {
            const userInfo = await get_user_info(auth.currentUser.uid);
            setThisUsername(userInfo.username);
        }
        getUsername();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            switch (mode) {
                case "25":
                    setStandings(await get25_top10());
                    setIsLoading(false);
                    break; 
                case "50": 
                    setStandings(await get50_top10());
                    setIsLoading(false);
                    break; 
                case "overall": 
                    setStandings(await get_overall_top10());
                    setIsLoading(false);
                    break;
            }
        }
        fetchData();
    }, [mode]);

    const handleClick = (newMode) => {
        if (mode === newMode) return;
        setIsLoading(true);
        setMode(newMode);
    }

    return (
        <div 
            id="leaderboard-panel"
            className="shadow"
        >
            <div id="leaderboard-header-container">
                <h1 id="leaderboard-header">Leaderboard</h1>
                <div id="leaderboard-button-container">
                    <button 
                        className={"leaderboard-button " + (mode === "25" ? "leaderboard-button-active" : "leaderboard-button-inactive")}
                        id="leaderboard-button-25"
                        onClick={() => handleClick("25")}
                    >
                        25-word
                    </button>
                    <button 
                        className={"leaderboard-button " + (mode === "50" ? "leaderboard-button-active" : "leaderboard-button-inactive")}
                        onClick={() => handleClick("50")}
                    >
                        50-word
                    </button>
                    <button 
                        className={"leaderboard-button " + (mode === "overall" ? "leaderboard-button-active" : "leaderboard-button-inactive")}
                        id="leaderboard-button-overall"
                        onClick={() => handleClick("overall")}
                    >
                        Overall
                    </button>
                </div>
            </div>
            <div id="standings-container">
                <div id="standings">
                    <div id="standings-category-header">
                        <span className="standings-category">#</span>
                        <span className="standings-category">username</span>
                        <span className="standings-category">avg wpm</span>
                        <span className="standings-category">avg acc</span>
                    </div>
                    {
                        isLoading 
                        ? <div id="no-standings-div">Loading...</div>
                        : standings.length === 0
                        ? <div id="no-standings-div">No standings for this category yet</div>
                        : standings.map((playerInfo, index) => (
                            <PlayerStanding
                                key={index}
                                playerInfo={playerInfo}
                                position={index + 1}
                                thisUsername={thisUsername}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
