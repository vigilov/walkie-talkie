import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {navigateTo} from "#app";

interface IAuthUser {
    uid: string
    displayName: string
    photoURL: string
}

export const useSignInWithGoogle = async () => {
    await signInWithPopup(getAuth(), new GoogleAuthProvider())
}

export const useSignOut = async () => {
    await getAuth().signOut()
    await navigateTo("/")
}

export const useAuthUser = async (): Promise<IAuthUser | undefined> => {
    const user = await getAuth().currentUser
    if (!user) {
        return undefined
    }

    return Promise.resolve(<IAuthUser>user)
}