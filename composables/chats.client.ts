import {
    doc,
    setDoc,
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy, getFirestore
} from "firebase/firestore";
import {useAuthUser} from "~/composables/auth.cient";

interface IChat {
    id: string
    topic: string
    unMatchedParticipants: Array<string>
    firstMessage: string
    createdBy: string
    createdAt: string
    status: string
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
    } catch (e) {
        console.error(e)
    }
}

export const useCreateChat = async (chat: IChat) => {
    await setDoc(doc(getFirestore(), "chats", chat.id), chat);
}

export const useChats = async (uid?: string): Promise<Array<IChat>> => {
    if (!uid) {
        return Promise.resolve([])
    }

    const s = getFirestore()

    const snap = await getDocs(query(
        collection(s, "chats"),
        where("createdBy", "==", uid),
        orderBy("createdAt", "desc"),
    ))

    const chats: Array<IChat> = []

    snap.forEach((doc) => {
        chats.push(<IChat>doc.data())
    })

    return Promise.resolve(chats)
}

export const useSendMessage = async (text: string, chatID: string) => {
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
        const docRef = await addDoc(collection(getFirestore(), "messages"), newMessage);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
