import {
    doc,
    setDoc,
    addDoc,
    updateDoc,
    collection,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy, getFirestore
} from "firebase/firestore";
import {useAuthUser} from "~/composables/auth.cient";

export enum ChatStatus {
    Off = "off",
    Opened = "opened",
    Pending = "pending",
    Resolved = "resolved",
    Closed = "closed"
}

export interface IChat {
    id: string
    topic: string
    unMatchedParticipants: Array<string>
    // responser: string
    firstMessage: string
    createdBy: string
    createdAt: string
    status: ChatStatus
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

export const useDeleteChat = async (chatID: string) => {
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

export const useChat = async (chatID: string): Promise<IChat> => {
    const s = getFirestore()

    const snap = await getDoc(doc(s, 'chats', chatID))

    return Promise.resolve(<IChat>await snap.data())
}

export const useNewExpert = async (chatID: string) => {
    const authUser = await useAuthUser()
    if (!authUser) {
        return
    }

    const s = getFirestore()

    const chat = await useChat(chatID)
    // chat.unMatchedParticipants.push(chat.responser)
    chat.status = ChatStatus.Pending

    console.log(chat)

    await updateDoc(doc(s, 'chats', chatID), {
        unMatchedParticipants: chat.unMatchedParticipants,
        status: chat.status,
    })
}