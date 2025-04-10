// 📄 src/firebase/firestore.ts
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';

export const createEvent = async (eventData: any) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const eventRef = doc(collection(db, 'events'));
  await setDoc(eventRef, {
    ...eventData,
    createdBy: user.uid,
    createdAt: new Date(),
  });
};
