import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";

export const useSignInWithGoogle = async () => {
    await signInWithPopup(getAuth(), new GoogleAuthProvider())
}
