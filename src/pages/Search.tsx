import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAvatar, IonLabel, IonGrid, IonRow, IonCol, IonIcon,IonSearchbar,IonItem,IonList } from '@ionic/react';
import { personCircle, peopleOutline, calendar,search, settingsOutline, home, searchOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router';
import './Search.css';

const Search: React.FC = () => {
  const history = useHistory(); // Call the useHistory hook to get the history object
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([
    { id: 1, name: 'La cafe', type: 'Event' },
    { id: 2, name: 'ASM', type: 'Club' },
    { id: 3, name: 'Music Fest', type: 'Event' },
  ]);

  const handleSearch = (e: CustomEvent) => {
    setQuery(e.detail.value!);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search🔎</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSearchbar value={query} onIonInput={handleSearch} placeholder="Search events or clubs..." />
        
        <IonList>
          {results.filter(item => item.name.toLowerCase().includes(query.toLowerCase())).map(item => (
            <IonItem key={item.id}>
              <IonIcon icon={searchOutline} slot="end" />
              <IonLabel>
                <h3>{item.name}</h3>
                <p>{item.type}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>

      {/* Bottom Navigation */}
      <IonToolbar>
        <IonGrid>
          <IonRow className="ion-justify-content-around">
            <IonButton fill="clear" onClick={() => history.push('/home')}>
              <IonIcon icon={home} /> 
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push('/create-event')}>
              <IonIcon icon={calendar} /> 
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push('/search')}>
              <IonIcon icon={search} /> 
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push('/profile')}>
              <IonIcon icon={personCircle} /> 
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonPage>
  );
};

export default Search;