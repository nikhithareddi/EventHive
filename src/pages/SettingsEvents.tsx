// src/pages/SettingsEvents.tsx

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonLabel,
  IonItem,
  IonButtons,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useHistory } from "react-router-dom"; // Needed for navigation

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  registeredUsers?: string[];
  createdBy?: string;
}

const SettingsEvents: React.FC = () => {
  const [userRole, setUserRole] = useState<"student" | "Club Member" | "">("");
  const [events, setEvents] = useState<EventData[]>([]);
  const history = useHistory();

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const role = userDoc.data()?.role || "student";
      setUserRole(role as "student" | "Club Member");

      let q;
      if (role === "student") {
        q = query(
          collection(db, "events"),
          where("registeredUsers", "array-contains", currentUser.uid)
        );
      } else if (role === "Club Member") {
        q = query(
          collection(db, "events"),
          where("createdBy", "==", currentUser.uid)
        );
      }

      const snapshot = await getDocs(q);
      const data: EventData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<EventData, "id">),
      }));

      setEvents(data);
    };

    fetchUserAndEvents();
  }, []);

  
  const formatDateTime = (dateStr: string) => {
    
    if (!dateStr) return "Date not available";
    
    const dateObj = new Date(dateStr);

    return dateObj.toLocaleString(); };

  const handleEdit = (event: EventData) => {
    history.push("/eventform", { event }); // Redirect to EventForm with event data
  };

  const handleDelete = async (eventId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {userRole === "Club Member" ? "Your Created Events" : "My Registered Events"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {events.length === 0 ? (
          <IonLabel>No events to show.</IonLabel>
        ) : (
          events.map((event) => (
            <IonCard key={event.id}>
              <IonCardHeader>
                <IonCardTitle>{event.title}</IonCardTitle>
                <IonCardSubtitle>{formatDateTime(event.date)}</IonCardSubtitle>
                <IonCardSubtitle>📍 {event.location}</IonCardSubtitle>

                {userRole === "Club Member" && (
                  <>
                    <IonCardSubtitle>
                      👥 {event.registeredUsers?.length || 0} student(s) registered
                    </IonCardSubtitle>

                    <IonButtons>
                      <IonButton onClick={() => handleEdit(event)} color="primary" size="small">
                        Edit
                      </IonButton>
                      <IonButton onClick={() => handleDelete(event.id)} color="danger" size="small">
                        Delete
                      </IonButton>
                    </IonButtons>
                  </>
                )}
              </IonCardHeader>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default SettingsEvents;
