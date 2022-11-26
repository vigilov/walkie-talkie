import {getFirestore, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {integer} from "vscode-languageserver-types";

export interface IUser {
    id: string
    devices: Array<string>
    bio?: string
    roles: Array<string>
    tacos: bigint
}

export const useUser = async (uid: string): Promise<IUser | undefined> => {
    const docRef = doc(getFirestore(), "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const user = <IUser>docSnap.data()
        if (!user.roles) {
            user.roles = <Array<string>>[]
        }
        return Promise.resolve(user);
    } else {
        console.log("user no exists");
    }

    return Promise.resolve(undefined);
}

export const useSetUser = async (user: IUser) => {
    await setDoc(doc(getFirestore(), "users", user.id), user);
}

export const useUpdateUser = async (uid: string, update: any) => {
    const ref = doc(getFirestore(), "users", uid);
    await updateDoc(ref, update);
}