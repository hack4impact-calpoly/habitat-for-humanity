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
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  margin-top: 1em;
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
      setPhotos(filesRef);
      console.log("New file state:", files);
    }
  }

  return (
    // prints out the images if props.photos is not empty, else drop container
    <div>
      {photos.length > 0 ? (
        <ImageContainer>
          {photos.map((photo: any, i: any) => (
            <img src={URL.createObjectURL(photo)} alt="uploaded" key={i} />
          ))}
        </ImageContainer>
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
