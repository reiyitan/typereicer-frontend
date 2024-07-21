import React from "react"; 
import { useState } from "react";
import "../authpages.css";
import { TextForm, Button, WarningMessage } from "../../components";
import { useFirebase } from "../../ContextProviders";
import { Link } from "react-router-dom"; 

export const RegisterPage = () => {
    const { register } = useFirebase();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); 
    const [pass, setPass] = useState(""); 
    const [confPass, setConfPass] = useState("");
    const [warningMsg, setWarningMsg] = useState(""); 

    const handleRegister = async () => {
        if (!username || !email || !pass || !confPass) {
            setWarningMsg("Please fill out all fields");
            return;
        }
        else if (username.includes(" ")) {
            setWarningMsg("No spaces allowed in username");
            return;
        }
        else if (pass !== confPass) {
            setWarningMsg("Passwords must match"); 
            return;
        }
        else {
            setWarningMsg("");
            register(username, email, pass, setWarningMsg);
        }   
    } 

    return (
        <div className="center-block shadow">
            <h1 className="light-header">Create an account</h1>
            <TextForm 
                value={username}
                setValue={setUsername}
                label="Username"
            />
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
            <TextForm 
                value={confPass}
                setValue={setConfPass}
                label="Confirm Password"
                type="password"
            />
            <WarningMessage 
                value={warningMsg} 
                setValue={setWarningMsg}
            />
            <Button 
                onClick={handleRegister} 
                value="Sign up"
            />
            <span className="redirect-link-container">
                Already have an account?
                <Link className="redirect-link" to="/login">Sign in</Link>
            </span>
        </div>
    );
}