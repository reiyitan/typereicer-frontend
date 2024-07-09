import React from "react"; 
import { useState, createContext, useContext } from "react"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 

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
                fastest25_acc: 0,
                fastest50: 0,
                fastest50_acc: 0,
                total_25_completed: 0,
                total_50_completed: 0,
                average_25_wpm: 0,
                average_50_wpm: 0
            });
            return user;
        }
        catch (error) {
            console.error(error);
            throw new Error(error.code);
        }
    }

    const updateMetrics = async (wpm, acc, numWords) => {
        if (acc < 70) return;
        const user = auth.currentUser; 
        const uid = user.uid; 
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const prevFastest = data[`fastest${numWords}`];
            const newFastest = (prevFastest < wpm) ? wpm : prevFastest;
            const prevFastestAcc = data[`fastest${numWords}_acc`];
            const newFastestAcc = (prevFastest < wpm) ? acc : prevFastestAcc;
            const prevAvg = data[`average_${numWords}_wpm`];
            const prevTotal = data[`total_${numWords}_completed`];
            const newAvg = ((prevAvg * prevTotal) + wpm) / (prevTotal + 1); 
            const newMetrics = {
                ...data,
                [`fastest${numWords}`]: newFastest,
                [`fastest${numWords}_acc`]: newFastestAcc,
                [`average_${numWords}_wpm`]: newAvg
            };
            await setDoc(doc(db, "users", uid), newMetrics);
        }
    }

    return (
        <FirebaseContext.Provider value={{token, setToken, login, register, updateMetrics}}>
            {children}
        </FirebaseContext.Provider>
    );
}

export const useFirebase = () => useContext(FirebaseContext);