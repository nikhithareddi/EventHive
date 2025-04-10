import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonGrid,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const history = useHistory();

  const handleRegister = async () => {
    if (!email || !password || !username || !name || !role) {
      alert("All fields are required!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        name,
        email,
        role,
      });

      alert("Registration successful!");
      history.push("/login");
    } catch (error: unknown) {
      console.error("Registration error:", error);
      if (error instanceof FirebaseError) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        fullscreen
        className="ion-padding"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: 'url("../bg.jpg")', // ✅ Ensure this image exists in /public
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <IonGrid
          style={{
            maxWidth: "400px",
            width: "100%",
            padding: "20px",
            backgroundColor: "rgba(185, 235, 248, 0.9)", // semi-transparent background
            borderRadius: "20px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Username</IonLabel>
                <IonInput type="text" value={username} onIonChange={(e) => setUsername(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Name</IonLabel>
                <IonInput type="text" value={name} onIonChange={(e) => setName(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel>Role</IonLabel>
                <IonSelect value={role} onIonChange={(e) => setRole(e.detail.value!)}>
                  <IonSelectOption value="user">User</IonSelectOption>
                  <IonSelectOption value="admin">Admin</IonSelectOption>
                  <IonSelectOption value="student">Student</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonButton expand="block" onClick={handleRegister} style={{ marginTop: "20px" }}>
                Register
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
