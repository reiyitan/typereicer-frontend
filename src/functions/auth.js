import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { fbApp, db } from "../fbUtils/fbApp";
import { doc, setDoc } from "firebase/firestore"; 
const auth = getAuth(fbApp);

export const register = async (username, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
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

export const login = async (email, password, username) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; 
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            fastest25: 16,
            fastest50: 16
        });
        console.log(user);
        return user;
    }
    catch (error) {
        console.error(error);
        throw new Error(error.code);
    }
}