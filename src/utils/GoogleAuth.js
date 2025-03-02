import { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "http://965101747211-9me9cl5uks1au9la40rp11jj5oimorr5.apps.googleusercontent.com";

const loadAuthClient = () => {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: CLIENT_ID,
      scope: "https://www.googleapis.com/auth/calendar.events",
    });
  });
};

export const signInWithGoogle = () => {
  gapi.auth2.getAuthInstance().signIn();
};

export const signOutFromGoogle = () => {
  gapi.auth2.getAuthInstance().signOut();
};

useEffect(() => {
  loadAuthClient();
}, []);
