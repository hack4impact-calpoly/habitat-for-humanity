const nextURL: string = "/api/event";

/* ------------------GET Requests-----------------*/

// Get ALL events
export const getEvents = async () =>
  fetch(nextURL, {
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

export const getEventByItemId = async (itemId: string) =>
  fetch(`${nextURL}/itemId/${itemId}`, {
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

/* ------------------Post Requests -------------------------- */

// Format for an event
export interface Event {
  title: string;
  startTime: Date;
  endTime: Date;
  itemId: string;
}

// Add a new Event to the Event DB
export const addEvent = async (event: Event) =>
  fetch(nextURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      itemId: event.itemId,
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        // check server response for errors
        throw new Error(`${res.status}-${res.statusText}`);
      }
      const result = await res.json();
      return res;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

export const deleteEventByItemId = async (itemId: string) =>
  fetch(`${nextURL}/itemId/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      const contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        // If it's JSON, parse the response as JSON
        const result = await res.json();
        return result;
      } else {
        // If it's not JSON, handle the response as text (e.g., "Successful")
        const result = await res.text();
        return { message: result };
      }
    })
    .catch((error) => console.error("Error: ", error));
