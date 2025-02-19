import { useState, useEffect } from "react";
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonLabel, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { personCircleOutline, peopleOutline, calendarOutline, settingsOutline, homeOutline, searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Profile</h2>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding profile-content">
        <div className="profile-header">
          <IonAvatar className="profile-avatar">
            <img 
              src={userData?.profilePic || "https://i.pinimg.com/736x/dc/4d/ee/dc4dee07ee34def633b005817464d384.jpg"} 
              alt="Profile Pic" 
            />
          </IonAvatar>
          <IonLabel className="profile-name">{userData?.username || "Your Name"}</IonLabel>
        </div>

        <IonGrid>
      
       
          <IonRow className="ion-justify-content-center">
            
            <IonCol size="8" className="profile-option" onClick={() => history.push('/settings-events')}>
              <IonIcon icon={calendarOutline} className="profile-icon" />
              <IonLabel>Events</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
          <IonCol size="8" className="profile-option" onClick={() => history.push('/edit-profile')}>
  <IonIcon icon={settingsOutline} className="profile-icon" />
  <IonLabel>Settings</IonLabel> 
</IonCol>

          </IonRow>
        </IonGrid>
      </IonContent>

     
    </IonPage>
  );
};

export default Profile;
