import {notifications} from "@mantine/notifications";

export function saveResponseNotification(response: { status: number; }, message: string) {
    if (response.status === 200) {
        notifications.show({
            title: "Saved",
            message: message,
            color: "green",
            position: "top-right"
        })
    } else {
        notifications.show({
            title: "Error",
            message: "Something went wrong",
            color: "red",
            position: "top-right"
        })
        console.error(response)
    }
}