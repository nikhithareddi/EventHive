import {
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent
  } from "@ionic/react";
  
  const events = [
    { title: "Hackathon 2025", description: "A 48-hour coding competition." },
    { title: "Startup Pitch", description: "Showcase your startup ideas." },
  ];
  
  export const EventList = () => (
    <IonGrid>
      <IonRow>
        {events.map((event, index) => (
          <IonCol key={index} size="12" size-sm="6" size-md="4">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{event.title}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>{event.description}</IonCardContent>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
  