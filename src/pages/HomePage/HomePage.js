import React from "react"; 
import { useEffect, useContext } from "react"; 
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom"; 
import "./HomePage.css";


export const HomePage = () => {
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
                    navigate("/login");
                }
            })
            .catch(error => console.error(error)); 
        }
        else {
            navigate("/login");
        }
    }, [authState]);
    return (
        <div>homepage</div>
    );
}