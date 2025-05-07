import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig} from "./firebaseConfig";
import {app} from "./firebaseConfig";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);


// VAPID key from Firebase settings
const vapidKey = "BEMUaQDRJsx-jhRZ53FJ3q8smK9WtakFGdDReF9AIhoew9tq_Q5-4wQku2AF_gUUDLgbSmFkIbRmBMyC4i-JGj0";


export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey });

    if (currentToken) {
      console.log("✅ FCM token:", currentToken);

      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const tokenRef = doc(db, "tokens", user.uid);
        await setDoc(tokenRef, {
          token: currentToken,
        });
        console.log("✅ FCM token saved to Firestore");
      } else {
        console.log("⚠️ No user is logged in.");
      }
    } else {
      console.log("❌ No registration token available. Request permission.");
    }
  } catch (error) {
    console.error("🔥 Error getting FCM token:", error);
  }
};
export const requestFirebaseNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
    });
    if (token) {
      console.log("FCM Token:", token);
      
    } else {
      console.log("No registration token available.");
    }
    return token;
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export {messaging};
