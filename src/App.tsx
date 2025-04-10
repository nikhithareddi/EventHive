import { Redirect, Route } from "react-router-dom";
import { IonApp, IonButton, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import { useEffect,useState } from "react";
import { Preferences } from "@capacitor/preferences";
import EventForm from "./pages/EventForm"; // Import the EventForm page
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./theme/global.css";
import "./theme/variables.css";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Auth from "./components/Auth";
import Calendar from "./pages/Calendar";
import {auth,db} from "./firebaseConfig";

setupIonicReact();

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load theme from storage on app start
    Preferences.get({ key: "theme" }).then((result) => {
      if (result.value === "dark") {
        document.body.classList.add("dark");
        setIsDarkMode(true);
      }
    });
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add("dark");
      Preferences.set({ key: "theme", value: "dark" });
    } else {
      document.body.classList.remove("dark");
      Preferences.set({ key: "theme", value: "light" });
    }
  };

  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/auth" component={Auth} />
        <Route exact path = "/login">
        <Login/>
        </Route>
        <Route exact path = "/register">
        <Register/>
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/create-event">
          <EventForm />
        </Route>
          <Route exact path="/search">
          <Search/>
        </Route>
        <Route>
          <Route exact path="/calendar">
          <Calendar/>
          </Route>
        </Route>
        
        <Route exact path="/profile">
        <Profile/>
        </Route>
         
        
      </IonRouterOutlet>
    </IonReactRouter>
    {/* Dark Mode Toggle Button */}
    <IonButton expand="full" onClick={toggleDarkMode} style={{ position: "fixed", top: "0px", right: "20px", zIndex: 1000, width: "40px", height: "10px" ,}}>
        {isDarkMode ? "🌞" : "🌙"}
      </IonButton>
  </IonApp>
);
};
export default App;
