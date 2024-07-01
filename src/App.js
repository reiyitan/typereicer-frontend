import "./App.css"; 
import React from "react";
import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage, RegisterPage, HomePage } from "./pages";
import { AuthContext } from "./AuthContext";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/home",
        element: <HomePage />
    }
])

function App() {
    const [authState, setAuthState] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("token"); 
        setAuthState(token);
    }, []); 

    return (
        <>
            <h1 id="page-title">TypeReicer</h1>
            <AuthContext.Provider value={{authState, setAuthState}}>
                <RouterProvider router={router} />
            </AuthContext.Provider>
        </>
    );
}

export default App;
