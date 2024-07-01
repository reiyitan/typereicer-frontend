import React from "react"; 
import { useEffect, useContext } from "react"; 
import { AuthContext } from "../../AuthContext";
import "./HomePage.css";


export const HomePage = () => {
    const { authState } = useContext(AuthContext);
    useEffect(() => {
        
    }, []); 

    return (
        <div>homepage</div>
    );
}