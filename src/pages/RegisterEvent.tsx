import React from "react";
import { IonButton } from "@ionic/react";
import { db } from "../firebase/firebaseConfig"
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth"; // Custom hook for user auth

const RegisterEvent: React.FC<{ eventId: string }> = ({ eventId }) => {
  const { user } = useAuth();

  const handleRegister = async () => {
    if (!user) {
      alert("Please log in to register for events.");
      return;
    }

    try {
      await addDoc(collection(db, `events/${eventId}/registrations`), {
        userId: user.uid,
        userName: user.displayName,
        timestamp: new Date(),
      });
      alert("Successfully registered for the event!");
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return <IonButton onClick={handleRegister}>Register</IonButton>;
};

export default RegisterEvent;
