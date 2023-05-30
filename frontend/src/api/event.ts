const eventURL: string = "http://localhost:3001/api/events/";

/* ------------------GET Requests-----------------*/

// Get ALL events
export const getEvents = async () =>
  fetch(eventURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      const result = await res.json();
      return result;
    })
    .catch((error) => console.error("Error: ", error)); // handle error*/

// Get AN event by its ID
export const getEventByID = async (ID: string) =>
  fetch(`${eventURL}eventId/${ID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      const result = await res.json();
      return result;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get ALL events with matching "title"
export const getEventsByTitle = async (title: string) =>
  fetch(`${eventURL}title/${title}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      const result = await res.json();
      return result;
    })
    .catch((error) => console.error("Error: ", error)); // handle error
/*
// Get ALL events with matching "startDate"
export const getEventsByStartDate = (startDate : string) => {
    fetch(eventURL + "location/" +startDate, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        return await res.text()
    })
    .then(events => {
        console.log(events);
        return events;
    })
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL events with matching "endDate"
export const getEventsByEndDate = (endDate : string) => {
    fetch(eventURL + endDate, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        return await res.text()
    })
    .then(events => {
        console.log(events);
        return events;
    })
    .catch(error => console.error("Error: ", error)) // handle error
}
*/
// Get ALL events with matching "endDate"
export const getEventsByLocation = async (location: string) =>
  fetch(`${eventURL}location/${location}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      const result = await res.json();
      return result;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

/* ------------------Post Requests -------------------------- */

// Format for an event
export interface Event {
  title: string;
  startTime: Date;
  endTime: Date;
  volunteerId: string;
  itemId: string;
}

// Add a new Event to the Event DB
export const addEvent = async (event: Event) =>
  fetch(eventURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      volunteerId: event.volunteerId,
      itemId: event.itemId,
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        // check server response for errors
        throw new Error(`${res.status}-${res.statusText}`);
      }
      const result = await res.json();
      console.log(result);
    })
    .catch((error) => console.error("Error: ", error)); // handle error
