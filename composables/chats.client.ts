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
    increment,
    orderBy, getFirestore,
} from "firebase/firestore";
import {useAuthUser} from "~/composables/auth.cient";
import {useShowModal} from "~/composables/modal-window.client";
import {useUpdateUser} from "~/composables/users.client";
import {navigateTo} from "#imports"

export enum ChatStatus {
    Off = "off",
    Opened = "opened",
    Pending = "pending",
    Resolved = "resolved",
    Closed = "closed"
}

export interface Responser {
    name: string
    photoURL: string
    id: string
    newMessages: number
}

export interface IChat {
    id: string
    topic: string
    unMatchedParticipants: Array<string>
    responser?: Responser
    firstMessage: string
    createdBy: string
    createdAt: string
    summary?: string
    newMessages: number
    status: ChatStatus
}

interface IAuthor {
    name: string
    avatarURL: string
    id: string
}

export interface IMessage {
    text: string
    author?: IAuthor
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

export const useOthersChats = async (uid?: string): Promise<Array<IChat>> => {
    if (!uid) {
        return Promise.resolve([])
    }

    const s = getFirestore()

    const snap = await getDocs(query(
        collection(s, "chats"),
        where("responser.id", "==", uid),
        where("status", "==", 'opened'),
        orderBy("createdAt", "desc"),
    ))

    const chats: Array<IChat> = []

    snap.forEach((doc) => {
        chats.push(<IChat>doc.data())
    })

    return Promise.resolve(chats)
}

export const useMyChats = async (uid?: string): Promise<Array<IChat>> => {
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

export const useUpdateChat = async (uid: string, update: any) => {
    const ref = doc(getFirestore(), "chats", uid);
    await updateDoc(ref, update);
}

export const useGetChat = async (uid: string) : Promise<IChat> => {
    const snap = await getDoc(doc(getFirestore(), "chats", uid));
    const chat = <IChat>snap.data()
    return Promise.resolve(chat);
}

export const useSendMessage = async (chatID: string, text: string) => {
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
        await addDoc(collection(getFirestore(), "messages"), newMessage);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const useSendSystemMessage = async (text: string, chatID: string) => {
    const authUser = await useAuthUser()
    if (!authUser) {
        return
    }

    const newMessage = {
        text: text,
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


    const chat = await useChat(chatID)
    if (chat.responser)
        chat.unMatchedParticipants.push(chat.responser.id)
    chat.status = ChatStatus.Pending

    await useUpdateChat(chatID, {
        unMatchedParticipants: chat.unMatchedParticipants,
        status: chat.status,
    })
}

export const useAbortChat = async (chatID: string) => {
    const authUser = await useAuthUser()
    if (!authUser) {
        return
    }

    const chat = await useChat(chatID)

    let ok = await useShowModal("Aborting", "Do you want to close the chat?", "ion:ios-close-circle-outline")
    if (!ok) {
        return
    }

    ok = await useShowModal("Closing the chat", "Has your question been resolved?", "uil:comment-alt-question")
    if (ok) {
        ok = await useShowModal("Rating the Expert", "Thank the Expert?", "ps:tacos")
        if (ok) {
            if (chat.responser) await useUpdateUser(chat.responser.id, {tacos: increment(1)})
        }

        await useUpdateChat(chatID, {
            status: ChatStatus.Resolved,
        })

        return
    }

    ok = await useShowModal("Finding another Expert", "Do you want to find another Expert?", "material-symbols:person-search-outline")
    if (ok) {
        await useNewExpert(chatID)
        return
    }

    await useUpdateChat(chatID, {
        status: ChatStatus.Closed,
    })

    await navigateTo('/chats')
}