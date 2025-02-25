import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const userURL = "http://localhost:3001/api/users/";
/* ----------------------Clerk User Requests---------------------------*/
export const updateMetadata = async (role: string, userId: string | null) =>
  fetch(`${userURL}/updateRole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role,
      userId,
    }),
  })
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      return response;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

/* ------------------GET Requests-----------------*/

// Get ALL users
export const getUsers = async () =>
  fetch(userURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const user = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      // console.log(user)
      return user;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get A user by "userID"
export const getUserByID = async (userID: string) => {
  try {
    const response = await fetch(`${userURL}id/${userID}`);
    if (!response.ok) {
      throw new Error(`${response.status}-${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
// Get ALL volunteers
export const getVolunteers = async () =>
  fetch(`${userURL}volunteers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const users = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      // console.log(users)
      return users;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get ALL donors
export const getDonors = async () =>
  fetch(`${userURL}donors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const users = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      // console.log(users)
      return users;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get ALL admins
export const getAdmins = async () =>
  fetch(`${userURL}admins`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const users = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      // console.log(users)
      return users;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

/* ----------------------POST/PUT Requests---------------------------*/

// User data model
export interface User {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  userType: string;
  id: string;
}

// Add a new User to User DB
export const addUser = async (user: User) =>
  fetch(userURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      phone: user.phone,
      id: user.id,
    }),
  })
    .then(async (res) => {
      const response = await res.json();
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
      return response;
    })
    .catch((error) => {
      console.error("Error in addUser:", error);
      throw error;
    });

// Update user info using Clerk API
export const updateUserInfoAPI = async (
  userId: string,
  params: { firstName?: string; lastName?: string; email?: string },
) => {
  console.log(process.env.CLERK_SECRET_KEY)
  console.log("Current environment:", process.env.NODE_ENV);
  console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);

  try {
    return await clerkClient.users.updateUser(userId, params);
  } catch (error) {
    console.error("Error in updateUserInfoAPI:", error);
    throw new Error(
      "Failed to update user info: " + error
        ? error.toString().message
        : "unable to update info",
    );
  }
};

// Update User "phone" (given userID)
export const updateUserPhone = async (userID: string, phone: string) =>
  fetch(`${userURL}phone/${userID}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      phone,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
    })
    .catch((error) => console.error("Error: ", error)); // handle error
