import {
    doc,
    setDoc,
    addDoc,
    updateDoc,
    collection,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy, getFirestore
} from "firebase/firestore";
import {useUpdateUser} from "~/composables/users.client";
import {useAuthUser} from "~/composables/auth.cient";

interface IChat {
    id: string;
    topic: string;
    keywords: Array<string>
    participants: Array<string>
    timestamp: number
}

interface IAuthor {
    name: string
    avatarURL: string
    id: string
}

export interface IMessage {
    text: string
    author: IAuthor
    timestamp: number
    chatID: string
    id?: string
}

export const useDeleteChat = async (uid: string, chatID: string) => {
    const s = getFirestore()

    try {
        await deleteDoc(doc(s, "chats", chatID));
        const userRef = doc(s, "users", uid);

        await updateDoc(userRef, {
            activeChat: null,
        });
    } catch (e) {
        console.error(e)
    }
}

export const useCreateChat = async (uid: string, chat: IChat) => {
    const s = getFirestore()
    await setDoc(doc(s, "chats", chat.id), chat);

    await useUpdateUser(uid, {
        activeChat: chat.id,
    })
}

export const useChats = async (uid?: string): Promise<Array<IChat>> => {
    if (!uid) {
        return Promise.resolve([])
    }

    const s = getFirestore()

    const snap = await getDocs(query(
        collection(s, "chats"),
        where("createdBy", "==", uid),
        orderBy("timestamp", "desc"),
    ))

    const chats: Array<IChat> = []

    snap.forEach((doc) => {
        chats.push(<IChat>doc.data())
    })

    return Promise.resolve(chats)
}

export const useSendMessage = async (text: string, chatID: string) => {
    const store = getFirestore()
    const authUser = await useAuthUser()
    if (!authUser) {
        return
    }

    const newMessage = {
        text: text,
        author: {name: authUser.displayName, avatarURL: authUser.photoURL, id: authUser.uid},
        timestamp: Date.now(),
        chatID: chatID
    };

    try {
        const docRef = await addDoc(collection(store, "messages"), newMessage);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
