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
  IonText,
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
    
        console.log("✅ User registered and profile created in Firestore.");
        
        history.push("/login");

      } catch (error: any) {
        console.error("❌ Registration error:", error.message);
        throw error;
      }
    };
    

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Register</h2>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid
          style={{
            maxWidth: "600px",
            width: "100%",
            padding: "20px",
            backgroundColor: "rgba(206, 235, 164, 0.9)", 
            borderRadius: "50px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <IonRow>
            <IonCol>
              <IonItem>
               
                <IonInput 
                 label="Username" labelPlacement="floating"
                 type="text" value={username} onIonChange={(e) => setUsername(e.detail.value!)} />
              </IonItem>
              <IonItem>
                
                <IonInput 
                 label="Full Name" labelPlacement="floating"type="text" value={name} onIonChange={(e) => setName(e.detail.value!)} />
              </IonItem>
              <IonItem>
                
                <IonInput
                 label="Email" labelPlacement="floating"
                  type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
              </IonItem>
              <IonItem>
               
                <IonInput
                 label="Password" labelPlacement="floating"
                  type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
              </IonItem>
              <IonItem>
                
                <IonSelect label="Role" interface="popover" labelPlacement="floating"
                value={role} onIonChange={(e) => setRole(e.detail.value!)}>
                  <IonSelectOption value="user">Club member</IonSelectOption>
              
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
