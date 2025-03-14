self.addEventListener('push', event => {


    const data = event.data.json();
    console.log('Push event received', data);

    // Try to play sound if possible
    if (clients.matchAll) {
        clients.matchAll({ type: 'window' }).then(clientList => {
            if (clientList.length > 0) {
                // If there's an open client, ask it to play the sound
                clientList[0].postMessage({
                    type: 'PLAY_NOTIFICATION_SOUND',
                    soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
                });
            }
        });
    }


    self.registration.showNotification(data.title, {
        body: data.message,

        icon: "https://i.postimg.cc/nrJZRVhM/teachers-team.jpg",
        data: data.message,
        actions: data.actions,
        silent: false,
        sound: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
    });

});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    // This will open the app when notification is clicked
    if (event.notification.data && event.notification.data.url) {
        clients.openWindow(event.notification.data.url);
    } else {
        clients.openWindow('/');
    }
});