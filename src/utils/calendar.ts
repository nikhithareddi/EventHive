import { gapi } from "gapi-script";

const CLIENT_ID = "606758242466-7rumul8r2mgqve7js8a82mhjqgi3couh.apps.googleusercontent.com";
const API_KEY = "YOUR_GOOGLE_API_KEY";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export const initGoogleCalendar = () => {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  });
};

export const addEventToGoogleCalendar = async (
  title: string,
  location: string,
  description: string,
  startDate: string
) => {
  try {
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }

    const event = {
      summary: title,
      location: location,
      description: description,
      start: {
        dateTime: startDate,
        timeZone: "America/New_York",
      },
      end: {
        dateTime: new Date(new Date(startDate).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: "America/New_York",
      },
    };

    const request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    await request.execute();
    alert("Event added to Google Calendar!");
  } catch (error) {
    console.error("Error adding event:", error);
    alert("Failed to add event.");
  }
};
