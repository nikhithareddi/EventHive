import { IonButton, IonContent, IonHeader, IonPage, IonCardSubtitle,IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAvatar, IonLabel, IonItem, IonIcon, IonList } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { heartOutline, personCircleOutline, calendarOutline, searchOutline, homeOutline } from 'ionicons/icons';
import "./Home.css";

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      {/* Hero Section */}
      <IonHeader>
        <IonToolbar className="hero-header">
          <IonItem lines="none">
            <IonAvatar slot="start">
              <img src="https://i.pinimg.com/736x/dc/4d/ee/dc4dee07ee34def633b005817464d384.jpg" alt="Profile" />
            </IonAvatar>
            <IonLabel><h2>Welcome, Eric 👋</h2></IonLabel>
            <IonButton fill="clear" slot="end">
              <IonIcon icon={personCircleOutline} />
            </IonButton>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent className="hero-content">
        <div className="hero-section">
          <h1>Join Amazing Events</h1>
          <p>Stay updated with the latest happenings around you.</p>
          <IonButton color="primary" onClick={() => history.push("/events")}>Explore Events</IonButton>
        </div>

        {/* Ongoing Events */}
        <h2>Ongoing Events <IonButton fill="clear" size="small">See all</IonButton></h2>
        <IonGrid>
          <IonRow>
            <IonCol size="4">
        <IonCard className="event-card">
          <IonItem lines="none">
          <IonCardHeader>
        <IonCardTitle>Food Fest</IonCardTitle>
        <IonCardSubtitle>March 12, 2:00pm</IonCardSubtitle>
      </IonCardHeader>
            <IonIcon icon={heartOutline} slot="end" />
          </IonItem>
        </IonCard>
        </IonCol>
        <IonCol size="4">
              <IonCard className="event-card">
                <IonItem lines="none">
                <IonCardHeader>
        <IonCardTitle>La cafe</IonCardTitle>
        <IonCardSubtitle>May 10, 5:00pm</IonCardSubtitle>
      </IonCardHeader>
                  <IonIcon icon={heartOutline} slot="end" />
                </IonItem>
              </IonCard>
            </IonCol>
        </IonRow>
        </IonGrid>

        {/* Upcoming Events */}
        <h2>Upcoming Events </h2>
        <IonGrid>
          <IonRow>
            <IonCol size="4">
              <IonCard className="event-card">
                <IonItem lines="none">
                <IonCardHeader>
        <IonCardTitle>Comedy Show</IonCardTitle>
        <IonCardSubtitle>May 5, 6:00pm</IonCardSubtitle>
      </IonCardHeader>
                  <IonIcon icon={heartOutline} slot="end" />
                </IonItem>
              </IonCard>
            </IonCol>
            <IonCol size="4">
              <IonCard className="event-card">
                <IonItem lines="none">
                <IonCardHeader>
        <IonCardTitle>Holi</IonCardTitle>
        <IonCardSubtitle>May 10, 5:00pm</IonCardSubtitle>
      </IonCardHeader>
                  <IonIcon icon={heartOutline} slot="end" />
                </IonItem>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      {/* Bottom Navigation */}
      <IonToolbar>
        <IonGrid>
          <IonRow className="ion-justify-content-around">
            <IonButton fill="clear" onClick={() => history.push("/home")}>
              <IonIcon icon={homeOutline} /> Home
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push("/create-event")}>
              <IonIcon icon={calendarOutline} /> Events
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push("/search")}>
              <IonIcon icon={searchOutline} /> Search
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push("/profile")}>
              <IonIcon icon={personCircleOutline} /> Profile
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonPage>
  );
};

export default Home;