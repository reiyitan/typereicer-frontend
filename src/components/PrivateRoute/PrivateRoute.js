import React from "react";
import "./PrivateRoute.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; 
import { useFirebase } from "../FirebaseProvider";

export const PrivateRoute = ({ children }) => {
    const { token, setToken } = useFirebase();
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetch("http://localhost:4000/auth/verify", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    token: token
                })
            })
            .then(res => res.json())
            .then(data => {
                if (!data.verified) {
                    localStorage.remove("token"); 
                    setToken(null);
                    setIsVerified(false);
                    setIsLoading(false);
                }
                else {
                    setIsVerified(true);
                    setIsLoading(false);
                }
            })
            .catch(error => console.error(error)); 
        }
        else {
            setIsLoading(false);
        }
    }, [token, setToken]);

    if (isLoading) {
        return (
            <div id="loading-div">Loading...</div>
        );
    }
    
    return (
        isVerified ? children : <Navigate to="/login" />
    );
} 