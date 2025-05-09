import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonApp,
  IonButton,
  IonRouterOutlet,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonPage,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { useHistory } from "react-router-dom";
import { signOut } from "firebase/auth";
import Home from "./pages/Home";
import EventForm from "./pages/EventForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Calendar from "./pages/Calendar";
import Auth from "./components/Auth";
import "./theme/global.css";
import "./theme/variables.css";
import EditProfile from "./pages/EditProfile";
import SettingsEvents from "./pages/SettingsEvents";

setupIonicReact();

const RouterWrapper: React.FC<{
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}> = ({ isDarkMode, setIsDarkMode }) => {
  const location = useLocation();
  const hideMenu = ["/login", "/register"].includes(location.pathname);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle("dark", newMode);
    Preferences.set({ key: "theme", value: newMode ? "dark" : "light" });
  };

  const history = useHistory();

const handleLogout = async () => {
  try {
    await signOut(auth);
    history.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};


  const navigateTo = (path: string) => {
    history.push(path);
    if (history.location.pathname === path) {
      if (path === '/calendar') {
        const currentUrl = window.location.href;
        window.location.href = currentUrl;
      }
    }
  };


  return !hideMenu ? (
    <IonSplitPane contentId="main-content">
      <IonMenu side="end" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            {/* Replace routerLink with onClick handlers for more reliable navigation */}
            <IonItem button onClick={() => navigateTo('/home')}>
              <IonLabel>Home</IonLabel>
            </IonItem>
            <IonItem button onClick={() => navigateTo('/create-event')}>
              <IonLabel>Create Event</IonLabel>
            </IonItem>
            <IonItem button onClick={() => navigateTo('/search')}>
              <IonLabel>Search</IonLabel>
            </IonItem>
            <IonItem button onClick={() => navigateTo('/calendar')}>
              <IonLabel>Calendar</IonLabel>
            </IonItem>
            <IonItem button onClick={() => navigateTo('/profile')}>
              <IonLabel>My Profile</IonLabel>
            </IonItem>
            <IonItem button onClick={handleLogout}>
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonList>


          
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
  <IonHeader>
    <IonToolbar>
      <IonTitle>Event Hive</IonTitle>
      <IonButtons slot="end">
        <IonMenuButton />
      </IonButtons>
    </IonToolbar>
  </IonHeader>

  <IonRouterOutlet id="main-content">
    <Route exact path="/auth" component={Auth} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/home" component={Home} />
    <Route exact path="/profile" component={Profile} />
    <Route exact path="/edit-profile" component={EditProfile} />
    <Route exact path="/settings-events" component={SettingsEvents} />
    <Route exact path="/search" component={Search} />
    <Route exact path="/create-event" component={EventForm} />
    <Route exact path="/calendar" component={Calendar} />
    <Redirect exact from="/" to="/login" />
  </IonRouterOutlet>

  <IonButton
    expand="full"
    onClick={toggleDarkMode}
    style={{
      position: "fixed",
      top: "0px",
      bottom: "2px",
      right: "40px",
      zIndex: 1000,
      width: "40px",
      height: "40px",
    }}
  >
    {isDarkMode ? "🌞" : "🌙"}
  </IonButton>
</IonPage>

    </IonSplitPane>
  ) : (
    <IonRouterOutlet>
      <Route exact path="/auth" component={Auth} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Redirect exact from="/" to="/login" />
    </IonRouterOutlet>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    Preferences.get({ key: "theme" }).then((result) => {
      if (result.value === "dark") {
        document.body.classList.add("dark");
        setIsDarkMode(true);
      }
    });

    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      alert(`📢 ${payload.notification?.title}: ${payload.notification?.body}`);
    });

    const requestAndSaveFCMToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const currentToken = await getToken(messaging, {
          vapidKey: "BEMUaQDRJsx-jhRZ53FJ3q8smK9WtakFGdDReF9AIhoew9tq_Q5-4wQku2AF_gUUDLgbSmFkIbRmBMyC4i-JGj0",
        });

        if (currentToken && auth.currentUser) {
          await setDoc(
            doc(db, "users", auth.currentUser.uid),
            { fcmToken: currentToken },
            { merge: true }
          );
          console.log("✅ FCM token saved");
        }
      } catch (error) {
        console.error("🔥 Error getting FCM token:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) requestAndSaveFCMToken();
    });

    return () => unsubscribe();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <RouterWrapper isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
