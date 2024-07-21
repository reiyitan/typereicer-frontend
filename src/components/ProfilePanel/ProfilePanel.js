import React from "react"; 
import { useState, useEffect } from "react"; 
import { useFirebase } from "../../ContextProviders";
import "./ProfilePanel.css"; 

export const ProfilePanel = () => {
    const [userInfo, setUserInfo] = useState(null);
    const { auth, get_user_info } = useFirebase();
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
        </div>
    );
}