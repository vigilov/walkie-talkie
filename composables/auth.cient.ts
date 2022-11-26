import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {navigateTo} from "#app";
import {useSetUser, useUser} from "~/composables/users.client";

export interface IAuthUser {
    uid: string
    displayName: string
    photoURL: string
}

export const useSignInWithGoogle = async (role?: string): Promise<string | undefined> => {
    const auth = await signInWithPopup(getAuth(), new GoogleAuthProvider())
    const user = await useUser(auth.user.uid)
    if (!user) {
        const roles: Array<string> = []
        if (role) {
            roles.push(role)
        }
        await useSetUser({
            id: auth.user.uid,
            devices: [],
            roles: roles,
            tacos: 0,
            name: <string>auth.user.displayName,
            photoURL: <string>auth.user.photoURL
        })

        return Promise.resolve(auth.user.uid)
    }
    return Promise.resolve(undefined)
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