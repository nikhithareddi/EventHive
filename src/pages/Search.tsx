import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth } from "../firebaseConfig";

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  clubName: string;
  location: string;
}


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

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [suggestedEvents, setSuggestedEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<EventData, "id">),
      }));
      setAllEvents(fetchedEvents);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setSuggestedEvents([]); 
    } else {
      const results = allEvents.filter((event) =>
        event.title.toLowerCase().includes(searchText.toLowerCase()) ||
        event.location.toLowerCase().includes(searchText.toLowerCase())
      );
      setSuggestedEvents(results);
    }
  }, [searchText, allEvents]);
  const formatDateTime = (dateStr: string) => {
    
    if (!dateStr) return "Date not available";

    const dateObj = new Date(dateStr);

    return dateObj.toLocaleString(); };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Search</h2>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          debounce={100}
          placeholder="Search by title"
        />

        <IonGrid>
          <IonRow>
            {suggestedEvents.map((event) => (
              <IonCol size="6" key={event.id}>
                <IonCard>
                <IonCardHeader>
    <IonCardTitle>{event.title}</IonCardTitle>
    <IonCardSubtitle>{event.clubName}</IonCardSubtitle>
    <IonCardSubtitle>{formatDateTime(event.date)}</IonCardSubtitle>
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
            ))}
          </IonRow>
        </IonGrid>

        {searchText && suggestedEvents.length === 0 && (
          <p style={{ padding: "1rem", textAlign: "center" }}>No matching events found.</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Search;
