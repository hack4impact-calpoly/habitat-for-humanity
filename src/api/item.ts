import { Event } from "redux/donationSlice";

const nextURL: string = "/api/item";
/* ------------------GET Requests----------------- */

// Get AN item by "itemID"
export const getItemByID = async (itemID: string) =>
  fetch(`${nextURL}/${itemID}`, {
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
      return item;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get ALL items with matching "donorID"
export const getItemsByDonorID = async (donorID: string) =>
  fetch(`${nextURL}/donorId/${donorID}`, {
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
      return items;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get items by status
export const getItemsByStatus = async (status: string) =>
  fetch(`${nextURL}/status/${status}`, {
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
      return item;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

/* ----------------------POST/PUT Requests---------------------------*/
// Item data model
export interface Item {
  _id?: string;
  name: string[];
  // images: [mongoose.Schema.ObjectId]
  size: string[];
  images: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  scheduling: string; // Pickup, Dropoff, or InStore
  timeAvailability: Event[];
  donorId: string;
  // type: mongoose.Schema.Types.ObjectId
  timeSubmitted: Date;
  timeApproved?: Date;
  status: string; // approved or needs approval
  notes?: string;
  // timeAccepted: Date
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  estimatedValue?: string;
  itemDetails?: string;
}

// Add a new Item to Item DB
export const addItem = async (item: Item) =>
  fetch(nextURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      name: item.name,
      size: item.size,
      images: item.images,
      address: item.address,
      city: item.city,
      state: item.state,
      zipCode: item.zipCode,
      scheduling: item.scheduling,
      timeAvailability: item.timeAvailability,
      timeSubmitted: item.timeSubmitted,
      status: item.status,
      donorId: item.donorId,
      donorName: item.donorName,
      donorEmail: item.donorEmail,
      donorPhone: item.donorPhone,
      estimatedValue: item.estimatedValue,
      itemDetails: item.itemDetails,
    }),
  })
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) {
        // check server response
        return false;
      }
      return true;
    })
    .catch((error) => {
      console.error("Error: ", error);
      return false;
    });

// Update Item
export const updateItem = async (item: Item) =>
  fetch(`${nextURL}/${item._id}`, {
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
      notes: item.notes,
      images: item.images,
    }),
  })
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) {
        console.error("Error updating item:", res.status, res.statusText);
        // check server response
        return false;
      }
      return true;
    })
    .catch((error) => {
      console.error("Error: ", error);
      return false;
    });

export const deleteItemByItemId = async (itemId: string) =>
  fetch(`${nextURL}/${itemId}`, {
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
