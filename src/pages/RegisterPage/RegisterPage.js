import React from "react"; 
import { useState } from "react";
import "../authpages.css";
import { TextForm, Button, WarningMessage } from "../../components";
import { Link } from "react-router-dom"; 

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
            fetch("http://127.0.0.1:4000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email, 
                    password: pass
                })
            })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error);
                }
                else {
                    return data;
                }
            })
            .then(data => {
                console.log(data)
            }) 
            .catch(error => {
                switch(error.message) {
                    case "auth/email-already-in-use":
                        setWarningMsg("Email already in use");
                        break;
                    default:
                        setWarningMsg("There was an unexpected issue logging in");
                        break;
                }
            })
        }   
    } 

    return (
        <div className="center-block">
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
                value="Sign up"
            />
            <span className="redirect-link-container">
                Already have an account?
                <Link className="redirect-link" to="/login">Sign in</Link>
            </span>
        </div>
    );
}