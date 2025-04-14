// This is the service worker for the React application
self.addEventListener('install', function() {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  console.log('Push message received:', event);
  
  let data = {};
  try {
    data = event.data.json();
  } catch (error) {
    console.error('Error parsing push data:', error);
    data = {
      title: 'Location Update',
      body: event.data.text()
    };
  }
  
  const options = {
    body: data.body || 'New location update available',
    icon: '/images/icon.png',
    badge: '/images/badge.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Location',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Location Update', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Handle the view action
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
}); 