import "./App.css"; 
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage, RegisterPage, HomePage } from "./pages";
import { PrivateRoute, FirebaseProvider } from "./components";

function App() {
    return (
        <>
            <h1 id="page-title">TypeReicer</h1>
            <FirebaseProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route 
                            path="/home" 
                            element={
                                <PrivateRoute>
                                    <HomePage />
                                </PrivateRoute>
                            } 
                        />
                    </Routes>
                </BrowserRouter>
            </FirebaseProvider>
        </>
    );
}

export default App;
