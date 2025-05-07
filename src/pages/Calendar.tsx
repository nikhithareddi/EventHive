import React, { useEffect, useState } from "react";
import { IonDatetime } from "@ionic/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./Calendar.css";

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  clubName: string;
  location: string;
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const eventList: EventData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EventData[];
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  
  const formatDate = (iso: string) => new Date(iso).toISOString().split("T")[0];

  
  const highlightedDates = (isoString: string) => {
    const dateStr = formatDate(isoString);
    const hasEvent = events.some((event) =>
      formatDate(event.date) === dateStr
    );

    if (hasEvent) {
      return {
        textColor: "#fff",
        backgroundColor: "#d63384",
      };
    }

    return undefined;
  };

  const eventsOnSelectedDate = events.filter(
    (event) => formatDate(event.date) === selectedDate
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ textAlign: "center" }}>Events Calendar</h2>

      <IonDatetime
        presentation="date"
        highlightedDates={highlightedDates}
        onIonChange={(e) => {
          const selected = (e.detail.value as string)?.split("T")[0];
          setSelectedDate(selected || null);
        }}
      />

      {selectedDate && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Events on {selectedDate}:</h3>
          {eventsOnSelectedDate.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {eventsOnSelectedDate.map((event) => (
                <div
                  key={event.id}
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderLeft: "4px solid #d63384",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <h4 style={{ margin: "0 0 0.25rem", color: "black" }}>{event.title}, {event.clubName}</h4>
                  <p style={{ margin: 0, color: "black" }}>🕒 {(new Date(event.date)).toLocaleString()}</p>
                  
                  <p style={{ margin: 0, color: "black" }}>📍 {event.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No events on this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
