import React from "react"; 
import { useState, useEffect, useContext } from "react";
import "../authpages.css";
import { TextForm, Button, WarningMessage } from "../../components";
import { Link, useNavigate } from "react-router-dom"; 
import { AuthContext } from "../../AuthContext";

export const RegisterPage = () => {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate(); 
    useEffect(() => {
        if (authState) {
            fetch("http://localhost:4000/auth/verify", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    token: authState
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.verified) {
                    //get fb data from uid and pass data to navigate
                    navigate("/home");
                }
            })
            .catch(error => console.error(error)); 
        }
    }, [authState]);

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
                    case "auth/invalid-email":
                        setWarningMsg("Enter a valid email");
                        break;
                    case "auth/weak-password":
                        setWarningMsg("Password should be at least 6 characters");
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