import { Event } from "redux/donationSlice";

const itemURL: string = "http://localhost:3001/api/items/";

/* ------------------GET Requests----------------- */

// Get ALL items
export const getItems = async () =>
  fetch(itemURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const items = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      // console.log(items);
      return items;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get AN item by "itemID"
export const getItemByID = async (itemID: string) =>
  fetch(`${itemURL}itemId/${itemID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const item = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      // console.log(item);
      return item;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get ALL items with matching "name"
export const getItemsByName = async (name: string) =>
  fetch(`${itemURL}name/${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const items = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      console.log(items);
      return items;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get ALL items with matching "location"
export const getItemsByLocation = async (address: string, city: string) =>
  fetch(`${itemURL}location/${city}/${address}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const items = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      console.log(items);
      return items;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get ALL items with matching "donorID"
export const getItemsByDonorID = async (donorID: string) =>
  fetch(`${itemURL}donorId/${donorID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const items = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      console.log(items);
      return items;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

/* ----------------------POST/PUT Requests---------------------------*/
// Item data model
export interface Item {
  _id?: string;
  name: string;
  // images: [mongoose.Schema.ObjectId]
  size: string;
  photos: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  scheduling: string; // Pickup or Dropoff
  timeAvailability: Event[];
  donorId: string;
  // type: mongoose.Schema.Types.ObjectId
  timeSubmitted: Date;
  timeApproved: Date;
  status: string; // approved or needs approval
  // notes: string
  // timeAccepted: Date
}

// Add a new Item to Item DB
export const addItem = async (item: Item) =>
  fetch(itemURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      name: item.name,
      size: item.size,
      photos: item.photos,
      address: item.address,
      city: item.city,
      zipCode: item.zipCode,
      scheduling: item.scheduling,
      timeAvailability: item.timeAvailability,
      timeSubmitted: item.timeSubmitted,
      status: item.status,
      donorId: item.donorId,
    }),
  })
    .then(async (res) => {
      const response = await res.json();
      console.log(res.ok);
      if (!res.ok) {
        // check server response
        return false;
        console.log(response);
        // throw new Error(res.status + "-" + res.statusText)
      }
      return true;
    })
    .catch((error) => {
      console.error("Error: ", error);
      return false;
    });

// Update Item
export const updateItem = async (item: Item) =>
  fetch(`${itemURL}/itemId/${item._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: item.name,
      size: item.size,
      address: item.address,
      city: item.city,
      zipCode: item.zipCode,
      scheduling: item.scheduling,
      timeAvailability: item.timeAvailability,
      timeSubmitted: item.timeSubmitted,
      timeApproved: item.timeApproved,
      status: item.status,
      donorId: item.donorId,
    }),
  })
    .then(async (res) => {
      const response = await res.json();
      console.log(res.ok);
      if (!res.ok) {
        // check server response
        return false;
        console.log(response);
        // throw new Error(res.status + "-" + res.statusText)
      }
      return true;
    })
    .catch((error) => {
      console.error("Error: ", error);
      return false;
    });
