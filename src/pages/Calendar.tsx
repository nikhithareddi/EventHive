import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Mock events (Replace with Firebase data)
const events = [
  { date: "2025-04-10", title: "Tech Conference" },
  { date: "2025-04-15", title: "Hackathon" },
  { date: "2025-04-20", title: "UI/UX Workshop" },
];

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState(new Date());

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Event Calendar</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <Calendar onChange={(value) => setDate(value as Date)} value={date} />

        <IonList>
          {events
            .filter((event) => event.date === date.toISOString().split("T")[0])
            .map((event, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>{event.title}</h2>
                  <p>{event.date}</p>
                </IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CalendarPage;
