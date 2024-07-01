import React from "react"; 
import { useState } from "react";
import "../authpages.css";
import { TextForm, Button, WarningMessage } from "../../components";
import { Link } from "react-router-dom";

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState(""); 
    const [warningMsg, setWarningMsg] = useState("");

    const handleLogin = () => {
        if (!username || !pass) {
            setWarningMsg("Please fill out all fields");
        }
        else {
            setWarningMsg("");
        }
    } 

    return (
        <div className="center-block">
            <h1 className="light-header">Sign in</h1>
            <TextForm 
                value={username} 
                setValue={setUsername}
                placeholder="Username or email"
            />
            <TextForm 
                value={pass} 
                setValue={setPass}
                placeholder="Password"
                type="password"
            />
            <WarningMessage 
                value={warningMsg}
                setValue={setWarningMsg}
            />
            <Button 
                onClick={handleLogin} 
                value="Sign in"
            />
            <span className="redirect-link-container">
                Don't have an account?
                <Link className="redirect-link" to="/register">Sign up</Link>
            </span>
        </div>
    );
}