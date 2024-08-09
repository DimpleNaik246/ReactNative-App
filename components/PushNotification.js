import PushNotification from "react-native-push-notification";

class notificationService {
    configure(onNotification) {
        PushNotification.configure({
            onNotification: function(notification) {
                console.log('NOTIFICATION:', notification);
                if(onNotification) {
                    onNotification(notification);
                }
            },
            popInitialNotification: true,
            requestPermissions: true,
        });

        
        this.createChannel();
    }

    createChannel() {
        PushNotification.createChannel(
            {
                channelId: "default-channel-id", // (required)
                channelName: "Default Channel", // (required)
                channelDescription: "A default channel", // (optional)
                playSound: false, // (optional) default: true
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    }

    localNotification(title, message) {
        PushNotification.localNotification({
            channelId: "default-channel-id", 
            title: title,
            message: message,
        });
    }
}

export const NotificationService = new notificationService();
