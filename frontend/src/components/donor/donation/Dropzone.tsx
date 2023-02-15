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

function DropZone(props: any): JSX.Element {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

  // props destructuring
  const { photos, setPhotos } = props;

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
      // convert the array of files into array of base64 strings
      // to make sure the data is serializable to store in state
      Promise.all(
        filesRef.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = (e: any) => resolve(reader.result as string);
            })
        )
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
