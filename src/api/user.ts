const nextURL = "/api/user";
/* ----------------------Clerk User Requests---------------------------*/
export const updateMetadata = async (userId: string | null) =>
  fetch(`${nextURL}/clerk/updateRole`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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

// Get A user by "userID"
export const getUserByID = async (userID: string) => {
  try {
    const response = await fetch(`${nextURL}/${userID}`);
    if (!response.ok) {
      throw new Error(`${response.status}-${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Get users with marketing enabled
export const getMarketingUsers = async () => {
  try {
    const response = await fetch(`${nextURL}/market`);
    if (!response.ok) {
      throw new Error(`${response.status}-${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Clerk API call to get donor info
export const getClerkUser = async (userId: string) => {
  try {
    const response = await fetch(`${nextURL}/clerk/${userId}`);
    if (!response.ok) {
      throw new Error(`${response.status}-${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/* ----------------------POST/PUT Requests---------------------------*/

// User data model
export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface MongoUser {
  id: string;
  phone: string;
  address: Address;
  marketingOption: boolean;
}

// Add a new User to User DB
export const addUser = async (user: MongoUser) =>
  fetch(nextURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      phone: user.phone,
      id: user.id,
      address: user.address,
      marketingOption: user.marketingOption,
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

export const updateUserInfoAPI = async (
  userId: string,
  params: { firstName?: string; lastName?: string },
) => {
  const response = await fetch(`${nextURL}/clerk/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params), // Send user info as the body
  });

  // Check for a successful response
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to update user info: ${errorMessage}`);
  }

  const updatedUser = await response.json();
  return updatedUser;
};

// Update User Mongo data (given userID)
export const updateUserMongo = async (
  userID: string,
  phone: string,
  address: Address,
  marketingOption: boolean,
) =>
  fetch(`${nextURL}/${userID}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify({
      phone,
      address,
      marketingOption,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        // check server response
        throw new Error(`${res.status}-${res.statusText}`);
      }
    })
    .catch((error) => console.error("Error: ", error)); // handle error
