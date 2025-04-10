import { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonButton,
  IonToast,
  IonGrid,
  IonRow,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { homeOutline, calendarOutline, searchOutline, personCircleOutline } from 'ionicons/icons';
import "./EventForm.css";
import { collection,addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { initGoogleCalendar, addEventToGoogleCalendar } from "../utils/calendar";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";

const EventForm: React.FC = () => {
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [eventLocation, setEventLocation] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventCategory, setEventCategory] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    initGoogleCalendar();
  }, []);

  const handleSubmit = async () => {
    if (!eventName || !eventDate || !eventCategory || !eventLocation) {
      alert("Please fill in all required fields.");
      return;
    }

    
  
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("You must be logged in to create an event.");
      return;
    }
    
  
    try {
      await addDoc(collection(db, "events"), {
        title: eventName,
        description: eventDescription,
        location: eventLocation,
        date: eventDate,
        category: eventCategory,
        createdBy: currentUser ? currentUser.uid : "anonymous",
        timestamp: new Date(),
      });
  
      alert("✅ Event successfully created!");
      setShowToast(true);
  
      // Optional: Clear form fields
      setEventName("");
      setEventDescription("");
      setEventLocation("");
      setEventDate("");
      setEventCategory("");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("❌ Failed to create event.");
    }
  };
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Event🧾</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Event Name*</IonLabel>
          <IonInput
            value={eventName}
            onIonChange={(e) => setEventName(e.detail.value as string)}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Event Description</IonLabel>
          <IonTextarea
            value={eventDescription}
            onIonChange={(e) => setEventDescription(e.detail.value as string)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Event Location*</IonLabel>
          <IonInput
            value={eventLocation}
            onIonChange={(e) => setEventLocation(e.detail.value as string)}
            required
          />
        </IonItem>

        <IonItem>
          <IonSelect label="Event Category" labelPlacement="floating"
            value={eventCategory}
            onIonChange={(e) => setEventCategory(e.detail.value as string)}
          >
            <IonSelectOption value="Workshop">Workshop/Conference</IonSelectOption>
            <IonSelectOption value="seminar">Tabling</IonSelectOption>
            <IonSelectOption value="social">Social Event</IonSelectOption>
            <IonSelectOption value="sports">Sports Event</IonSelectOption>
            <IonSelectOption value="other">Other</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Date*</IonLabel>
          <IonDatetime
            presentation="date-time" preferWheel={true}
            value={eventDate}
            onIonChange={(e) => setEventDate(e.detail.value as string)}
          ></IonDatetime>
        </IonItem>

        <IonButton expand="block" color="primary" onClick={handleSubmit}>
          Register
        </IonButton>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Event Registered!"
          duration={2000}
        />
      </IonContent>

      <IonToolbar>
        <IonGrid>
          <IonRow className="ion-justify-content-around">
            <IonButton fill="clear" routerLink="/home">
              <IonIcon icon={homeOutline} /> Home
            </IonButton>
            <IonButton fill="clear" routerLink="/eventform">
              <IonIcon icon={calendarOutline} /> Events
            </IonButton>
            <IonButton fill="clear" routerLink="/search">
              <IonIcon icon={searchOutline} /> Search
            </IonButton>
            <IonButton fill="clear" routerLink="/profile">
              <IonIcon icon={personCircleOutline} /> Profile
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonPage>
  );
};

export default EventForm;
