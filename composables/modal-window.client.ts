import {ref, useState} from '#imports'

export interface IModalWindow {
    opened: boolean;
    icon: string;
    title: string;
    text: string;
    result: boolean;
}

export const useShowModal = async (title: string, text: string, icon: string): Promise<boolean> => {
    const modal = useState("modal", (): IModalWindow => <IModalWindow>{opened: false})

    modal.value.title = title
    modal.value.text = text
    modal.value.icon = icon
    modal.value.opened = true

    return new Promise((resolve, _) => {
        const m = <IModalWindow>modal.value
        watch(m, () => {
            resolve(m.result)
        })
    })
}