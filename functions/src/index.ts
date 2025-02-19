import * as functions from "firebase-functions"; 
import * as admin from "firebase-admin";

admin.initializeApp();

export const createUserProfile = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;

  await admin.firestore().collection("users").doc(uid).set({
    email,
    displayName: displayName || "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`✅ Created Firestore profile for user: ${uid}`);
});



export const sendNotificationOnNewEvent = functions.firestore
  .document("events/{eventId}")
  .onCreate(async (snap, context) => {
    const newEvent = snap.data();

    const payload = {
      notification: {
        title: "🎉 New Event: " + newEvent.title,
        body: newEvent.description || "Check out the latest event on Event Hive!",
        click_action: "http://localhost:8100"

      },
    };

    
    const tokensSnapshot = await admin.firestore().collection("users").get();
    const tokens: string[] = [];

    tokensSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.fcmToken) {
        tokens.push(data.fcmToken);
      }
    });

    if (tokens.length > 0) {
      await admin.messaging().sendToDevice(tokens, payload);
      console.log(`✅ Notification sent to ${tokens.length} users`);
    } else {
      console.log("⚠️ No tokens available to send notifications.");
    }
  });
