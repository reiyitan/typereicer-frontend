import React from "react"; 
import { useState } from "react";
import "../authpages.css";
import { TextForm } from "../../components";

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState(""); 

    return (
        <div>
            login page
        </div>
    );
}