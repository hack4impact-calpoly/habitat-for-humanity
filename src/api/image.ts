const nextURL: string = "/api/image"

/* ------------------GET Requests----------------- */

export const getPresignedImage = async (imageName: string) =>
  fetch(`${nextURL}/filename/${imageName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`${res.status}-${res.statusText}`);
      }
      const body = await res.json();
      return body.url;
    })
    .catch((error) => console.error("Error: ", error)); // handle error

/* ----------------------POST/PUT Requests---------------------------*/

// Add images to S3
export const addImages = async (images: File[]): Promise<string[]> => {
  const body = new FormData();
  images.forEach((file) => {
    body.append("file", file, file.name);
  });

  try {
    const response = await fetch(nextURL, {
      method: "POST",
      body: body,
    });

    const data = await response.json()

    if (response.ok && data.uploaded) {
      return data.uploaded;
    } else {
      throw new Error("Failed to uploade images")
    }
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
};

// delete image by filename
export const deleteImage = async (filename: string | undefined) => {
  try {
    const response = await fetch(`${nextURL}/filename/${filename}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete image");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
