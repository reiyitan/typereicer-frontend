import React from "react"; 
import { useState } from "react";
import "../authpages.css";
import { TextForm, Button, WarningMessage } from "../../components";
import { useFirebase } from "../../ContextProviders";
import { Link, Navigate } from "react-router-dom";

export const LoginPage = () => {
    const { token, login } = useFirebase();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState(""); 
    const [warningMsg, setWarningMsg] = useState("");

    const handleLogin = async () => {
        if (!email || !pass) {
            setWarningMsg("Please fill out all fields");
        }
        else {
            setWarningMsg("");
            try {
                const user = await login(email, pass, setWarningMsg);
                console.log("logged in:", user);
            }
            catch (error) {
                switch (error.message) {
                    case "auth/invalid-email":
                        setWarningMsg("Invalid email");
                        break;
                    case "auth/invalid-credential":
                        setWarningMsg("Incorrect email or password");
                        break;
                    default:
                        setWarningMsg("An unexpected error occurred while signing in");
                        break;
                }
            }
        }
    } 

    if (token) {
        return <Navigate to="/home" />
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