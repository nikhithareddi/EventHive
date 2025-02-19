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
  IonSelect,
  IonModal,
  IonDatetimeButton,
  IonSelectOption,
} from "@ionic/react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useHistory } from "react-router-dom";
import { getAuth } from "firebase/auth";

const EventForm: React.FC = () => {
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [eventLocation, setEventLocation] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>(new Date().toISOString());
  const [eventCategory, setEventCategory] = useState<string>("");
  const [eventclubName, setClubName] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    const checkUserRole = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("You must be logged in.");
        history.push("/login");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData.role);

          if (userData.role !== "Club Member") {
            alert("Only Club Members can create events.");
            history.push("/home");
          }

        } else {
          alert("User data not found.");
          history.push("/home");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        alert("Failed to retrieve user info.");
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  const handleSubmit = async () => {
    if (!eventName || !eventDate || !eventCategory || !eventLocation || !eventclubName) {
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
        clubName: eventclubName,
        createdBy: currentUser.uid,
        creatorRole: "Club Member",
        timestamp: new Date(),
        registeredUsers: [],
      });

      alert("✅ Event successfully created!");
      setShowToast(true);

      // Clear form
      setEventName("");
      setEventDescription("");
      setEventLocation("");
      setEventDate(new Date().toISOString());
      setEventCategory("");
      setClubName("");

    } catch (error) {
      console.error("Error creating event:", error);
      alert("❌ Failed to create event.");
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p>Loading...</p>
        </IonContent>
      </IonPage>
    );
  }

  if (userRole !== "Club Member") {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Access Denied</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <h2>Access Denied</h2>
          <p>You are not authorized to create events.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Event Form</h2>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Event Name*"
            labelPlacement="floating"
            value={eventName}
            onIonChange={(e) => setEventName(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Club Name*"
            labelPlacement="floating"
            value={eventclubName}
            onIonChange={(e) => setClubName(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonTextarea
            label="Description"
            labelPlacement="floating"
            value={eventDescription}
            onIonChange={(e) => setEventDescription(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Location*"
            labelPlacement="floating"
            value={eventLocation}
            onIonChange={(e) => setEventLocation(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonSelect
            label="Category"
            interface="popover"
            labelPlacement="floating"
            value={eventCategory}
            onIonChange={(e) => setEventCategory(e.detail.value!)}
          >
            <IonSelectOption value="Workshop">Workshop/Conference</IonSelectOption>
            <IonSelectOption value="Tabling">Tabling</IonSelectOption>
            <IonSelectOption value="Social">Social Event</IonSelectOption>
            <IonSelectOption value="Sports">Sports Event</IonSelectOption>
            <IonSelectOption value="Other">Other</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonDatetimeButton datetime="datetime" />
          <IonModal keepContentsMounted={true}>
            <IonDatetime
              id="datetime"
              presentation="date-time"
              value={eventDate}
              onIonChange={(e) => setEventDate(e.detail.value as string)}
              formatOptions={{
                date: { weekday: "short", month: "long", day: "2-digit" },
                time: { hour: "2-digit", minute: "2-digit" },
              }}
            />
          </IonModal>
        </IonItem>

        <IonButton
          expand="block"
          color="primary"
          onClick={handleSubmit}
          disabled={!eventName || !eventDate || !eventCategory || !eventLocation || !eventclubName}
        >
          Create Event
        </IonButton>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Event created successfully!"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default EventForm;
