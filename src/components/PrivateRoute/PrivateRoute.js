import React from "react";
import "./PrivateRoute.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; 
import { useFirebase } from "../../ContextProviders";

export const PrivateRoute = ({ children }) => {
    const { auth } = useFirebase();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setIsLoading(false);
            setIsLoggedIn(true);
        }
        else {
            setIsLoading(false); 
            setIsLoggedIn(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div id="loading-div">Loading...</div>
        );
    }
    else {
        return (
            isLoggedIn ? children : <Navigate to="/login" />
        );
    }
} 