export const addEventToGoogleCalendar = async (eventData) => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      console.error("User is not signed in");
      return;
    }
  
    const accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
  
    const event = {
      summary: eventData.title,
      location: eventData.location,
      description: eventData.description,
      start: {
        dateTime: eventData.startTime,
        timeZone: "America/New_York",
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: "America/New_York",
      },
    };
  
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
  
      const result = await response.json();
      console.log("Event added:", result);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };
  