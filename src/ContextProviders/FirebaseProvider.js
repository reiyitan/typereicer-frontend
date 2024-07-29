import React from "react"; 
import { useState, useEffect, createContext, useContext } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, orderBy, limit, where, getDocs } from "firebase/firestore"; 

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
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home");
            } else if (!user && location.pathname !== "/login" && location.pathname !== "/register") {
                navigate("/login");
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email, password, setWarningMsg) => {
        setPersistence(auth, browserLocalPersistence)
        .then(() => {
            return signInWithEmailAndPassword(auth, email, password);
        })
        .catch((error) => {
            switch (error.code) {
                case "auth/invalid-email":
                    setWarningMsg("Invalid email");
                    break;
                case "auth/invalid-credential":
                    setWarningMsg("Incorrect email or password");
                    break;
                default:
                    setWarningMsg("An unexpected error occurred while signing in");
                    break;
            }
        });
    }

    const signout = () => {
        signOut(auth)
        .then(() => {
            navigate("/login");
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const register = (username, email, password, setWarningMsg) => {
        setPersistence(auth, browserLocalPersistence)
        .then(() => {
            return createUserWithEmailAndPassword(auth, email, password);
        })
        .then((userCredential) => {
            const user = userCredential.user;
            setDoc(doc(db, "users", user.uid), {
                username: username,
                fastest25: 0,
                fastest25_acc: 0,
                fastest50: 0,
                fastest50_acc: 0,
                total_25_completed: 0,
                total_50_completed: 0,
                total_completed: 0,
                average_25_wpm: 0,
                average_25_acc: 0,
                average_50_wpm: 0,
                average_50_acc: 0,
                average_overall_wpm: 0,
                average_overall_acc: 0,
                rank: 0
            });
        })
        .catch((error) => {
            switch(error.code) {
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
        });
    }

    const updateMetrics = async (wpm, acc, numWords) => {
        if (acc < 70) return;
        const user = auth.currentUser; 
        const uid = user.uid; 
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();

            //mode-specific
            const prevFastest = data[`fastest${numWords}`];
            const newFastest = (prevFastest < wpm) ? wpm : prevFastest;
            const prevFastestAcc = data[`fastest${numWords}_acc`];
            const newFastestAcc = (prevFastest < wpm) ? acc : prevFastestAcc;
            const prevAvgWpm = data[`average_${numWords}_wpm`];
            const prevTotalCompleted = data[`total_${numWords}_completed`];
            const newAvgWpm = ((prevAvgWpm * prevTotalCompleted) + wpm) / (prevTotalCompleted + 1); 
            const prevAvgAcc = data[`average_${numWords}_acc`];
            const newAvgAcc = ((prevAvgAcc * prevTotalCompleted) + acc) / (prevTotalCompleted + 1);

            //overall
            const thisTotal = (numWords === 25) ? data[`total_25_completed`] + 1 : data[`total_50_completed`] + 1;
            const otherTotal = (numWords === 25) ? data[`total_50_completed`] : data[`total_25_completed`];
            const otherAvgWpm = (numWords === 25) ? data[`average_50_wpm`] : data[`average_25_wpm`];
            const newAvgOverallWpm = ((newAvgWpm * thisTotal) + (otherAvgWpm * otherTotal)) / (thisTotal + otherTotal);

            const otherAvgAcc = (numWords === 25) ? data[`average_50_acc`] : data[`average_25_acc`];
            const newAvgOverallAcc = ((newAvgAcc * thisTotal) + (otherAvgAcc * otherTotal)) / (thisTotal + otherTotal);

            const newRank = Math.min(Math.floor(newAvgOverallWpm / 10), 16);

            const newMetrics = {
                ...data,
                [`fastest${numWords}`]: newFastest,
                [`fastest${numWords}_acc`]: newFastestAcc,
                [`average_${numWords}_wpm`]: newAvgWpm,
                [`average_${numWords}_acc`]: newAvgAcc,
                [`total_${numWords}_completed`]: prevTotalCompleted + 1,
                "total_completed": thisTotal + otherTotal,
                [`average_overall_wpm`]: newAvgOverallWpm,
                [`average_overall_acc`]: newAvgOverallAcc,
                "rank": newRank
            };
            await setDoc(doc(db, "users", uid), newMetrics);
        }
    }

    const get_user_info = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userInfo = docSnap.data();
            return userInfo;
        }
        else {
            console.error("Could not fetch user data");
        }
    }

    const get25_top10 = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("total_25_completed", ">", 4), orderBy("average_25_wpm", "desc"), limit(10));
        const qSnapshot = await getDocs(q);
        let res = []; 
        qSnapshot.forEach((doc) => {
            const userInfo = doc.data(); 
            res.push({
                "username": userInfo.username,
                "average_wpm": userInfo.average_25_wpm,
                "average_acc": userInfo.average_25_acc
            });
        });
        return res;
    }

    const get50_top10 = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("total_50_completed", ">", 4), orderBy("average_50_wpm", "desc"), limit(10));
        const qSnapshot = await getDocs(q);
        let res = []; 
        qSnapshot.forEach((doc) => {
            const userInfo = doc.data(); 
            res.push({
                "username": userInfo.username,
                "average_wpm": userInfo.average_50_wpm,
                "average_acc": userInfo.average_50_acc
            });
        });
        return res;
    }

    const get_overall_top10 = async () => {
        const usersRef = collection(db, "users"); 
        const q = query(usersRef, where("total_completed", ">", 4), orderBy("average_overall_wpm", "desc"), limit(10));
        const qSnapshot = await getDocs(q); 
        let res = []; 
        qSnapshot.forEach((doc) => {
            const userInfo = doc.data(); 
            res.push({
                "username": userInfo.username,
                "average_wpm": userInfo.average_overall_wpm,
                "average_acc": userInfo.average_overall_acc
            });
        });
        return res; 
    }

    return (
        <FirebaseContext.Provider value={{auth, login, register, signout, updateMetrics, get_user_info, get25_top10, get50_top10, get_overall_top10}}>
            {!isLoading && children}
        </FirebaseContext.Provider>
    );
}

export const useFirebase = () => useContext(FirebaseContext);