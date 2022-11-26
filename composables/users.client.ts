import {getFirestore, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";

interface IUser {
    id?: string
    devices: Array<string>
    activeChat?: string
}

export const useUser = async (uid: string): Promise<IUser> => {
    const docRef = doc(getFirestore(), "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return Promise.resolve(<IUser>docSnap.data());
    } else {
        console.log("user no exists");
    }

    return Promise.resolve({devices: []});
}

export const useSetUser = async (uid: string, user: IUser) => {
    await setDoc(doc(getFirestore(), "users", uid), user);
}

export const useUpdateUser = async (uid: string, update: any) => {
    const ref = doc(getFirestore(), "users", uid);
    await updateDoc(ref, update);
}