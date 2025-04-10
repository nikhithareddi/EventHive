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
          <IonTitle className="center-text">Profile</IonTitle>
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
          <IonLabel className="profile-name">{userData?.username || "Loading..."}</IonLabel>
        </div>

        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="4" className="profile-option" onClick={() => history.push('/clubs')}>
              <IonIcon icon={peopleOutline} className="profile-icon" />
              <IonLabel>Clubs</IonLabel>
            </IonCol>
            <IonCol size="4" className="profile-option" onClick={() => history.push('/events')}>
              <IonIcon icon={calendarOutline} className="profile-icon" />
              <IonLabel>Events</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="10" className="profile-option" onClick={() => history.push('/settings')}>
              <IonIcon icon={settingsOutline} className="profile-icon" />
              <IonLabel>Settings</IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      {/* Bottom Navigation */}
      <IonToolbar>
        <IonGrid>
          <IonRow className="ion-justify-content-around">
            <IonButton fill="clear" onClick={() => history.push('/home')}>
              <IonIcon icon={homeOutline} /> Home
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push('/create-event')}>
              <IonIcon icon={calendarOutline} /> Events
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push('/search')}>
              <IonIcon icon={searchOutline} /> Search
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push('/profile')}>
              <IonIcon icon={personCircleOutline} /> Profile
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonPage>
  );
};

export default Profile;
