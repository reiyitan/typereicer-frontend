import React from "react"; 
import { useState } from "react";
import "../authpages.css";
import { TextForm, Button, WarningMessage } from "../../components";

export const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); 
    const [pass, setPass] = useState(""); 
    const [confPass, setConfPass] = useState("");
    const [warningMsg, setWarningMsg] = useState(""); 

    const handleRegister = () => {
        if (!username || !email || !pass || !confPass) {
            setWarningMsg("Please fill out all fields");
            return;
        }
        else if (pass !== confPass) {
            setWarningMsg("Passwords must match"); 
            return;
        }
        else {
            setWarningMsg("");
        }   
    } 

    return (
        <div id="center-block">
            <h1 className="light-header">Create an account</h1>
            <TextForm 
                value={username}
                setValue={setUsername}
                placeholder="Username"
            />
            <TextForm 
                value={email}
                setValue={setEmail}
                placeholder="Email"
            />
            <TextForm 
                value={pass}
                setValue={setPass}
                placeholder="Password"
                type="password"
            />
            <TextForm 
                value={confPass}
                setValue={setConfPass}
                placeholder="Confirm Password"
                type="password"
            />
            <WarningMessage 
                value={warningMsg} 
                setValue={setWarningMsg}
            />
            <Button 
                onClick={handleRegister} 
                value="Sign Up"
            />
        </div>
    );
}