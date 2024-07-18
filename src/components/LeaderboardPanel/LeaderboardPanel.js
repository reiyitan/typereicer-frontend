import React from "react";
import { useEffect, useState } from "react";
import "./LeaderboardPanel.css"; 
import { useFirebase } from "../../ContextProviders";

const Player = ({playerInfo}) => {
    return (
        <div>
            {playerInfo.username}
        </div>
    )
}

export const LeaderboardPanel = () => {
    const { get25_top10, get50_top10 } = useFirebase();
    const [players25, setPlayers25] = useState([]);
    const [players50, setPlayers50] = useState([]); 

    useEffect(() => {
        const fetchData = async () => {
            setPlayers25(await get25_top10());
            setPlayers50(await get50_top10());
        }
        fetchData();
    }, []);

    return (
        <div 
            id="leaderboard-panel"
            className="shadow"
        >
            <div id="leaderboard-header-container">
                <h1 id="leaderboard-header">Leaderboard</h1>
            </div>
            <div id="standings-container">
                <div id="standings-25">
                    
                </div>
                <div id="standings-50">

                </div>
            </div>
        </div>
    );
}
