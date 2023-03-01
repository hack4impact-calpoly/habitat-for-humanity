import React, { MutableRefObject, useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import styled from "styled-components";

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
  margin-top: 2em;
`;

const Message = styled.h1`
  font-size: 15px;
  line-height: 25px;
  color: var(--black);
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

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    console.log("Dropped");
    e.preventDefault();
    processFilesInput(e.dataTransfer.files);
  }, []);

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

      // Convert the array of files into array of base64 strings
      // to make sure the data is serializable to store in state
      Promise.all(
        filesRef.map(async (file) => {
          // Compress the file before converting it to base64
          const quality = 40; // Adjust the quality level as desired from 0 - 100
          const compressedFile = (await compressImage(file, quality)) as Blob;
          console.log("Compressed file:", compressedFile);
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = (e: any) => resolve(reader.result as string);
          });
        })
      ).then((photoData) => {
        setPhotos(photoData);
        console.log("New file state:", photoData);
      });
    }
  }

  return (
    // prints out the images if props.photos is not empty, else drop container
    <div>
      {photos.length > 0 ? (
        <div>
          <ClearMessage onClick={() => setPhotos([])}>
            Clear Images
          </ClearMessage>
          <ImageContainer>
            {photos.map((base64String: any, i: any) => (
              <img
                src={base64String}
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
