import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonButton, IonItem, IonLabel, IonAvatar,
  IonGrid, IonRow, IonCol, IonIcon,IonInputPasswordToggle,
  IonText,
  IonCard
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
    if (!email || !password) {
      alert("Please enter information again.");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user.email);
      history.push('/home');
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
      <IonHeader translucent={true}>
        <IonToolbar>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}> Login</h2>
        </IonToolbar>
      </IonHeader>

      
        <IonContent
        fullscreen
        className="login-content"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#121212', // fallback dark background
          backgroundImage: 'url("/bg-login.jpg")', // your background image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='login-box'>
      <IonGrid
          style={{
            maxWidth: '500px',
            width: '100%',
            padding: '20px',
            backgroundColor: 'rgba(236, 164, 215, 0.95)',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          <IonRow >
            <IonCol size="12">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <IonAvatar style={{ width: '100px', height: '100px', margin: '0 auto' }}>
                  <img src="https://i.pinimg.com/736x/53/7c/4c/537c4c8dabcb330f1e367af2a6738e1d.jpg" alt=""/>
                  
                </IonAvatar>
              </div>
              <IonItem>
                
                <IonInput
                  label="Email" labelPlacement="floating" placeholder="🏫@neiu.edu"
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
            
                <IonInput
                label="Password" labelPlacement="floating" placeholder="🫣" 
                
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  
                />
              </IonItem>
              <IonButton expand="block" onClick={handleLogin} style={{ marginTop: '20px' }}>
                Login
              </IonButton>
              <p style={{ textAlign: 'center', marginTop: '10px' }}>
                Don't have an account? <Link to="/register"><IonText color="secondary">Register</IonText></Link>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
