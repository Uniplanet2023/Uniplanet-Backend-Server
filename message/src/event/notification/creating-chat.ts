
export const creatingChatNotification = (receiverToken:string, chat:string) => {
    const notificationPayload = {
        data: {
            chat: chat,
            type: "creating chat"
        },
        apns: {
            headers: {
                "apns-priority": "5",
                "apns-push-type": "background",
                "apns-topic": "com.example.uniplanetMobile"
            },
            payload: {
                aps: {
                    "content-available": 1,
                }
            }
        },
        token: receiverToken
    };
    return notificationPayload;
};