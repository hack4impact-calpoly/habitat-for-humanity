import React, { MutableRefObject, useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import styled from "styled-components";
import { addImages, deleteImage, getImageByName } from "../../../api/image";

const DropContainer = styled.div`
  height: 275px;
  border: 1px dashed var(--dashed-box);
  display: flex;
  flex: column nowrap;
  justify-content: center;
  align-content: center;
  background-color: var(--background);
  &:hover {
    cursor: pointer;
  }
`;

const UploadIcon = styled.div`
  width: 50px;
  height: 50px;
  background: url(https://img.icons8.com/pastel-glyph/64/000000/upload--v1.png)
    no-repeat center center;
  background-size: 100%;
  text-align: center;
  margin: 0 auto;
  margin-top: 1em;
  padding-top: 30px;
`;

const DropMessage = styled.div`
  text-align: center;
  color: var(--primary);
  font-size: 23px;
  font-weight: 500;
  margin-top: 1.2em;
`;

const Message = styled.h1`
  font-size: 15px;
  line-height: 25px;
  color: var(--black);
  text-align: center;
`;

const Input = styled.input`
  height: 275px;
  border: 1px dashed var(--dashed-box);
  display: flex;
  flex: column nowrap;
  justify-content: center;
  align-content: center;
  background-color: var(--background);
`;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  flex-gap: 10px;
  background-color: var(--background);
  border: 1px dashed var(--dashed-box);
`;

const ClearMessage = styled.div`
  text-align: left;
  color: var(--secondary);
  font-size: 15px;
  font-weight: 500;
  &:hover {
    cursor: pointer;
    color: var(--red);
  }
`;

const compressImage = async (file: Blob, quality: number) => {
  // Create a new Image
  const image = new Image();
  image.src = URL.createObjectURL(file);
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  // Create a canvas and draw the image on it
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  context?.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Compress the image and return the compressed image as a Blob
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/jpeg",
      quality / 100
    );
  });
};

function DropZone(props: any): JSX.Element {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

  // props destructuring
  const { photos, setPhotos } = props;

  // Set the maximum image size limit
  const MAX_IMAGE_SIZE = 5000000; // 5 MB
  // Set the maximum number of images to be uploaded
  const MAX_IMAGE_COUNT = 10;
  // Set the compressed image quality (1-100)
  const COMPRESSED_IMAGE_QUALITY = 40;

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    console.log("Dropped");
    e.preventDefault();
    processFilesInput(e.dataTransfer.files);
  }, []);

  const clearImages = async (photos: string[]): Promise<void> => {
    try {
      // Delete each image from S3 using the deleteImage function
      await Promise.all(
        photos.map((photoUrl) => {
          const filename = photoUrl.split("/").pop();
          return deleteImage(filename);
        })
      );
    } catch (error) {
      console.error("(clearImages) Error: ", error);
      throw error;
    }
    setPhotos([]);
  };

  const getPresignedUrl = async (filename: string): Promise<string> => {
    /* Get presigned URL form backend (router.get('/presigned-url/:filename')) using fetch directly: */
    const response = await fetch(
      `http://localhost:3001/api/images/presigned-url/${filename}`
    );

    if (!response.ok) {
      throw new Error("Error getting presigned URL");
    }

    const presignedUrl = await response.json();
    console.log("RETRIEVED PRESIGNED URL:", presignedUrl);
    return presignedUrl.url;
  };

  /* Send image files array to S3 and receive URL */
  const sendImagesToS3 = async (files: File[]): Promise<string[]> => {
    // Generate a unique name for each file
    const timestamp = new Date().getTime();
    const newUniqueFiles = files.map((file, index) => {
      const mimeString = file.type;
      const fileName = `image-${timestamp}-${index}.${
        mimeString.split("/")[1]
      }`;
      return new File([file], fileName, { type: mimeString });
    });
    try {
      console.log(
        "(sendImagesToS3) Uploading following images: ",
        newUniqueFiles
      );
      await addImages(newUniqueFiles);
      console.log("(sendImagesToS3) Images uploaded successfully for state!");
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }

    console.log("the files argument list in sendImagesToS3:", newUniqueFiles);

    // generate presigned URLs for each image
    const imageUrls = await Promise.all(
      newUniqueFiles.map((file) => {
        const fileName = file.name;
        return getPresignedUrl(fileName);
      })
    );

    // const imageUrls = newUniqueFiles.map(
    //   (file) =>
    //     `https://habitat4humanity-images.s3.us-west-2.amazonaws.com/${file.name}`
    // );

    return imageUrls;
  };

  function processFilesInput(files: FileList | null) {
    if (files) {
      const filesRef = Array.from(files);
      console.log("This fileRefs are:", filesRef);
      const fileType: string = filesRef[0].type;
      console.log("The first file upload is of type:", fileType);

      // Check each file's size and return if it exceeds the limit
      const tooLargeFiles = filesRef.filter(
        (file) => file.size > MAX_IMAGE_SIZE
      );
      if (tooLargeFiles.length) {
        console.log("Too Large Files:", tooLargeFiles);
        alert(
          "Some files are too large. Please only upload files smaller than 5MB."
        );
        return;
      }

      if (filesRef.length > MAX_IMAGE_COUNT) {
        alert(`Please only upload up to ${MAX_IMAGE_COUNT} images.`);
        return;
      }

      // Convert the array of files into array of compressed Blob objects
      Promise.all(
        filesRef.map(async (file, index) => {
          // Compress the file before uploading it to S3
          console.log("compressing file...");
          const compressedFile = await compressImage(
            file,
            COMPRESSED_IMAGE_QUALITY
          );
          return compressedFile;
        })
      )
        .then((compressedFiles) => {
          // Send the compressed image files to S3 and retrieve their URLs
          console.log("a file compression done.");
          console.log(
            "compressedFiles as file[] ready for sending: ",
            compressedFiles as File[]
          );
          console.log("starting sending to S3...");
          return sendImagesToS3(compressedFiles as File[]);
        })
        .then((imageUrls) => {
          console.log("imageUrls retrieved... setting state...");
          setPhotos(imageUrls);
          console.log("New file state:", imageUrls);
        })
        .catch((error) => {
          console.error("Error: ", error);
          alert("An error occurred while uploading the images");
        });
    }
  }

  return (
    // prints out the images if props.photos is not empty, else drop container
    <div>
      {photos.length > 0 ? (
        <div>
          <ClearMessage onClick={() => clearImages(photos)}>
            Clear Images
          </ClearMessage>
          <ImageContainer>
            {photos.map((url: any, i: any) => (
              <img
                src={url}
                alt="uploaded"
                key={i}
                style={{
                  height: "auto",
                  width: "auto",
                  margin: "10px",
                  maxWidth: "20%",
                  objectFit: "cover",
                }}
              />
            ))}
          </ImageContainer>
        </div>
      ) : (
        <DropContainer
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <DropMessage>
            Upload Your Images
            <UploadIcon />
            <Message>
              drop your image files or <br />
              <span style={{ color: "var(--secondary)" }}>browse</span> to
              choose a file
              <br />
              <span style={{ color: "silver" }}>
                maximum {(MAX_IMAGE_SIZE / 1000000).toFixed(0)}MB
              </span>
              <br />
              <span style={{ color: "silver" }}>
                limit of {MAX_IMAGE_COUNT} images
              </span>
              <input
                type="file"
                onChange={(e) => processFilesInput(e.target.files)}
                hidden
                multiple
                accept="image/*"
                ref={inputRef}
              />
            </Message>
          </DropMessage>
        </DropContainer>
      )}
    </div>
  );
}
export default DropZone;
