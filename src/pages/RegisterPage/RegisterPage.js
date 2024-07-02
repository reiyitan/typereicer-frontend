import React from "react"; 
import { useState, useEffect, useContext } from "react";
import "../authpages.css";
import { TextForm, Button, WarningMessage } from "../../components";
import { Link, useNavigate } from "react-router-dom"; 
import { AuthContext } from "../../AuthContext";
import { register } from "../../functions";

export const RegisterPage = () => {
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
            try {
                const user = await register(username, email, pass);
                const token = user.stsTokenManager.accessToken;
                localStorage.setItem("token", token);
                setAuthState(token); 
                navigate("/home");
            }
            catch (error) { 
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
                        setWarningMsg("An unexpected error occurred while signing up");
                        break;
                }
            }
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