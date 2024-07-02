import React from "react"; 
import { useState, useEffect, useContext } from "react";
import "../authpages.css";
import { TextForm, Button, WarningMessage } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { login } from "../../functions";

export const LoginPage = () => {
    const { authState, setAuthState } = useContext(AuthContext);
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
                if (!data.verified) {
                    localStorage.remove("token"); 
                    setAuthState(null);
                }
                else {
                    navigate("/home");
                }
            })
            .catch(error => console.error(error)); 
        }
    }, [authState]);

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
                const user = await login(email, pass, "alba");
                const token = user.stsTokenManager.accessToken;
                localStorage.setItem("token", token);
                setAuthState(token);
                navigate("/home");
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

    return (
        <div className="center-block">
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