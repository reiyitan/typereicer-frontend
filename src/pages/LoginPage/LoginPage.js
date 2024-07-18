import React from "react"; 
import { useState } from "react";
import "../authpages.css";
import { TextForm, Button, WarningMessage } from "../../components";
import { useFirebase } from "../../ContextProviders";
import { Link } from "react-router-dom";

export const LoginPage = () => {
    const { login } = useFirebase();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState(""); 
    const [warningMsg, setWarningMsg] = useState("");

    const handleLogin = () => {
        if (!email || !pass) {
            setWarningMsg("Please fill out all fields");
        }
        else {
            setWarningMsg("");
            login(email, pass, setWarningMsg);
        }
    } 

    return (
        <div className="center-block shadow">
            <h1 className="light-header">Sign in</h1>
            <TextForm 
                value={email} 
                setValue={setEmail}
                label="Email"
            />
            <TextForm 
                value={pass} 
                setValue={setPass}
                label="Password"
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