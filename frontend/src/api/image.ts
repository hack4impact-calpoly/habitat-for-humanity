const imageURL: string = "http://localhost:3001/api/images/";

/* ------------------GET Requests----------------- */

// Get all images
export const getImages = async () =>
  fetch(imageURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`${res.status}-${res.statusText}`);
      }
      console.log(data);
      return data;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

// Get image by id
export const getImageByID = async (imageID: string) =>
  fetch(`${imageURL}/${imageID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`${res.status}-${res.statusText}`);
      }
      return res.blob();
    })
    .catch((error) => console.error("Error: ", error)); // handle error

/* ----------------------POST/PUT Requests---------------------------*/

// Add images to S3
export const addImages = async (images: File[]): Promise<boolean> => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("productImage", image);
  });
  try {
    const res = await fetch(imageURL, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`${res.status}-${res.statusText}`);
    }
    console.log("Images uploaded successfully");
    return true;
  } catch (error) {
    console.error("Error: ", error);
    return false;
  }
};
