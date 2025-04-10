import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonButton, IonItem, IonLabel, IonAvatar,
  IonGrid, IonRow, IonCol, IonIcon
} from '@ionic/react';
import { useHistory, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { FirebaseError } from 'firebase/app';
import { personCircleOutline } from 'ionicons/icons';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user.email);
      history.push('/home'); // or wherever your home page is
    } catch (error) {
      if (error instanceof FirebaseError) {
        alert(`Login failed: ${error.message}`);
      } else {
        alert("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        fullscreen
        className="ion-padding"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'url("")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
         <div className = "flex-center"></div>
        <IonGrid
          style={{
            maxWidth: '400px',
            width: '100%',
            padding: '20px',
            backgroundColor: 'rgba(236, 164, 215, 0.95)',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          <IonRow className="flex-center">
            <IonCol size="12">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <IonAvatar style={{ width: '100px', height: '100px', margin: '0 auto' }}>
                  <IonIcon icon={personCircleOutline} style={{ fontSize: '100px' }} />
                </IonAvatar>
              </div>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                />
              </IonItem>
              <IonButton expand="block" onClick={handleLogin} style={{ marginTop: '20px' }}>
                Login
              </IonButton>
              <p style={{ textAlign: 'center', marginTop: '10px' }}>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
