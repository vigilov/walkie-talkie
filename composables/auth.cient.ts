import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {navigateTo} from "#app";
import {useSetUser, useUser} from "~/composables/users.client";

interface IAuthUser {
    uid: string
    displayName: string
    photoURL: string
}

export const useSignInWithGoogle = async () => {
    const auth = await signInWithPopup(getAuth(), new GoogleAuthProvider())
    const user = await useUser(auth.user.uid)
    if (!user) {
        await useSetUser({id: auth.user.uid, devices: []})
    }
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