import React from "react"; 
import { useState, createContext, useContext } from "react"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

export const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
export const db = getFirestore(fbApp);
const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; 
            const token = user.stsTokenManager.accessToken;
            setToken(token);
            localStorage.setItem("token", token);
            return user;
        }
        catch (error) {
            console.error(error);
            throw new Error(error.code);
        }
    }

    const register = async (username, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const token = user.stsTokenManager.accessToken;
            setToken(token);
            localStorage.setItem("token", token);
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                fastest25: 0,
                fastest50: 0
            });
            return user;
        }
        catch (error) {
            console.error(error);
            throw new Error(error.code);
        }
    }

    return (
        <FirebaseContext.Provider value={{token, setToken, login, register}}>
            {children}
        </FirebaseContext.Provider>
    );
}

export const useFirebase = () => useContext(FirebaseContext);