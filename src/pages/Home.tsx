import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonAvatar,
  IonLabel,
  IonItem,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import {
  heartOutline,
  personCircleOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./Home.css";
import { onSnapshot } from "firebase/firestore";

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  clubName: string;
  registeredUsers?: string[];
}

const Home: React.FC = () => {
  const history = useHistory();
  const [myEvents, setMyEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(collection(db, "events"));
  
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const data: EventData[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<EventData, "id">),
          }));
          setMyEvents(data);
        });
  
        return () => unsubscribeSnapshot();
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  
 
  const handleRegister = async (eventId: string) => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to register");
  
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        registeredUsers: arrayUnion(user.uid),
      });
      alert("You have registered for the event!");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      if (!dateStr || !timeStr) return "Date not available";
  
      const [year, month, day] = dateStr.split("-");
      const [hour, minute] = timeStr.split(":");
  
      const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute)
      );
  
      return date.toLocaleString("en-US", {
        month: "short", // Apr
        day: "numeric", // 13
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (err) {
      console.error("Error in formatDateTime:", err);
      return "Invalid date";
    }
  };
  
  

  return (
    <IonPage>
      <IonContent className="hero-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1>Join Amazing Events</h1>
          <p>Stay updated with the latest happenings around you.</p>
          
        </div>

        {/* My Events */}
        <div>
          <h2 style={{ padding: "1rem 0 0.5rem" }}>Events</h2>
          <IonGrid>
            <IonRow>
              {myEvents.length > 0 ? (
                myEvents.map((event) => (
                  <IonCol size="6" key={event.id}>
                    <IonCard className="event-card">
                    <IonCardHeader>
    <IonCardTitle>{event.title}</IonCardTitle>
    <IonCardSubtitle>{event.clubName}</IonCardSubtitle>
    <IonCardSubtitle>{formatDateTime(event.date, event.time)}</IonCardSubtitle>
  </IonCardHeader>
  <IonItem lines="none">
    📍 {event.location}
    <IonButton
      size="small"
      fill="outline"
      slot="end"
      onClick={() => handleRegister(event.id)}
    >
      Register
    </IonButton>
  </IonItem>
                    </IonCard>
                  </IonCol>
                ))
              ) : (
                <IonCol>
                  <p style={{ padding: "0 1rem" }}>You haven't created any events.</p>
                </IonCol>
              )}
            </IonRow>
          </IonGrid>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Home;
