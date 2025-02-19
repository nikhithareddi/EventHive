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
  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
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
        day: "numeric", // 15
        hour: "numeric", // 3
        minute: "2-digit", // 00
        hour12: true, // PM/AM
      });
    } catch (err) {
      return "Invalid date";
    }
  };
  
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
