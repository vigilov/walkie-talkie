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

export const useUpdateChat = async (uid: string, update: any) => {
    const ref = doc(getFirestore(), "chats", uid);
    await updateDoc(ref, update);
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

    await useUpdateChat( chatID, {
        unMatchedParticipants: chat.unMatchedParticipants,
        status: chat.status,
    })
}

export const useAbortChat = async(chatID: string) => {
    const authUser = await useAuthUser()
    if (!authUser) {
        return
    }

    const s = getFirestore()
    const chat = await useChat(chatID)

    let ok = await useShowModal("Abort chat", "Has your question been resolved?", "uil:comment-alt-question")
    if (ok) {
        ok = await useShowModal("Rate the Expert", "Thank the Expert?", "ps:tacos")
        if (ok) {
            await useUpdateUser(chat.responser, {tacos: increment(1)})
        }

        await useUpdateChat(chatID, {
            status: ChatStatus.Resolved,
        })

        // TODO: создание суммаризации

        return
    }

    ok = await useShowModal("Find another Expert", "Do you want to find another Expert?", "material-symbols:person-search-outline")
    if (ok) {
        await useNewExpert(chatID)
        return
    }

    await useUpdateChat(chatID, {
        status: ChatStatus.Closed,
    })

    // TODO: на глагне
}