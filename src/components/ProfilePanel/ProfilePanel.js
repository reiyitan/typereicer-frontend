import React from "react"; 
import { useState, useEffect } from "react"; 
import { useFirebase } from "../../ContextProviders";
import "./ProfilePanel.css"; 
import { rank_enum } from "../../utils";
import { rankSources } from "../../assets";

export const ProfilePanel = () => {
    const [userInfo, setUserInfo] = useState(null);
    const { auth, get_user_info, signout } = useFirebase();
    useEffect(() => {
        const uid = auth.currentUser.uid; 
        const getInfo = async () => {
            const userInfo = await get_user_info(uid);
            setUserInfo(userInfo);
        }
        getInfo();
    }, []);

    if (!userInfo) {
        return (
            <div id="profile-panel" className="shadow">
                <p id="loading-profile-msg">loading...</p>
            </div>
        ); 
    }

    return (
        <div
            id="profile-panel"
            className="shadow"
        >
            <div id="profile-header-container">
                <h1 id="profile-header">{userInfo.username}{userInfo.username[userInfo.username.length - 1] === "s" ? "'" : "'s"} profile</h1>
            </div>
            <div id="profile-info-container">
                <div id="profile-stats">
                    <div className="profile-stat-container">
                        <p className="profile-info-category">Overall wpm</p>
                        <p className="profile-info-stat">{userInfo.weightedAvgWpm.toFixed(2)} ({userInfo.weightedAvgAcc.toFixed(2)}%)</p>
                    </div>
                    <div className="profile-stat-container">
                        <p className="profile-info-category">Average wpm (25)</p>
                        <p className="profile-info-stat">{userInfo.average_25_wpm.toFixed(2)} ({userInfo.average_25_acc.toFixed(2)}%)</p>
                    </div>
                    <div className="profile-stat-container">
                        <p className="profile-info-category">Average wpm (50)</p>
                        <p className="profile-info-stat">{userInfo.average_50_wpm.toFixed(2)} ({userInfo.average_50_acc.toFixed(2)}%)</p>
                    </div>
                    <div className="profile-stat-container">
                        <p className="profile-info-category">Fastest 25</p>
                        <p className="profile-info-stat">{userInfo.fastest25.toFixed(2)} ({userInfo.fastest25_acc.toFixed(2)}%)</p>
                    </div>
                    <div className="profile-stat-container">
                        <p className="profile-info-category">Fastest 50</p>
                        <p className="profile-info-stat">{userInfo.fastest50.toFixed(2)} ({userInfo.fastest50_acc.toFixed(2)}%)</p>
                    </div>
                    <div className="profile-stat-container">
                        <p className="profile-info-category">Total completed (25)</p>
                        <p className="profile-info-stat">{userInfo.total_25_completed}</p>
                    </div>
                    <div className="profile-stat-container">
                        <p className="profile-info-category">Total completed (50)</p>
                        <p className="profile-info-stat">{userInfo.total_50_completed}</p>
                    </div>
                </div>
                <div id="profile-rank">
                    <p id="profile-rank-img-title">TypeReicer rank: {rank_enum[userInfo.rank]}</p>
                    <img id="profile-rank-img" src={rankSources[userInfo.rank]} alt="rank-img" />
                </div>
            </div>
            <div id="sign-out-button-container">
                <button id="sign-out-button" onClick={() => signout()}>Sign out</button>
            </div>
        </div>
    );
}