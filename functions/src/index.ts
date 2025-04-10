import * as functions from "firebase-functions"; // ✅ v1 import
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
