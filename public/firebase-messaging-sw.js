// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDvMyJUV637MaRVfgfx336nl2wHons1-aA",
    authDomain: "sample-firebase-ai-app-f47e7.firebaseapp.com",
    projectId: "sample-firebase-ai-app-f47e7",
    storageBucket: "sample-firebase-ai-app-f47e7.firebasestorage.app",
    messagingSenderId: "606758242466",
    appId: "1:606758242466:web:1b0887cd82b52b9471effb",
  vapidKey: "BEMUaQDRJsx-jhRZ53FJ3q8smK9WtakFGdDReF9AIhoew9tq_Q5-4wQku2AF_gUUDLgbSmFkIbRmBMyC4i-JGj0", // This should be from Firebase Console
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
