import { useState } from "react";
import { IonButton, IonInput, IonItem, IonLabel, IonPage, IonContent, IonToast } from "@ionic/react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // New field
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
        profilePic: "https://i.pinimg.com/736x/dc/4d/ee/dc4dee07ee34def633b005817464d384.jpg", // Default pic
        createdAt: new Date(),
      });

      setMessage("User registered successfully!");
      setIsError(false);
    } catch (error: any) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Username</IonLabel>
          <IonInput type="text" value={username} onIonChange={(e) => setUsername(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
        </IonItem>

        <IonButton expand="full" onClick={handleSignup}>Sign Up</IonButton>
        <IonToast isOpen={!!message} message={message} duration={2000} color={isError ? "danger" : "success"} />
      </IonContent>
    </IonPage>
  );
};

export default Auth;
