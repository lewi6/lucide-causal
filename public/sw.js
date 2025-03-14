
/* global clients */
self.addEventListener('push', (event) => {
    if (!event.data) {
        console.log('Push event but no data');
        return;
    }

    console.log('Push event received', event);

    const data = event.data.json();
    // Extract channel and event from data (matching Pusher structure)
    const { channel, event: eventName, data: notificationData } = data;

    // Add timestamp and ID to match your existing notification structure
    const notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        title: notificationData.title,
        message: notificationData.message,
        read: false,
        ...notificationData
    };

    event.waitUntil(
        self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
            .then((clientList) => {
                const hasActiveClient = clientList.some(client =>
                    client.visibilityState === 'visible'
                );

                // Save to localStorage regardless of client state
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        // Send message to client to save notification
                        client.postMessage({
                            type: 'NEW_NOTIFICATION',
                            notification
                        });
                    });
                });

                // Only show system notification if no active clients
                if (!hasActiveClient) {
                    const options = {
                        body: notification.message,
                        icon: '/notification-icon.svg',
                        badge: '/notification-badge.svg',
                        data: {
                            channel,
                            event: eventName,
                            ...notification
                        }
                    };

                    return self.registration.showNotification(notification.title, options);
                }
            })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Get the original notification data
    const data = event.notification.data;

    event.waitUntil(
        self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
            .then((clientList) => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return self.clients.openWindow('/');
            })
    );
});