import React from "react";
import styled from "styled-components";

const DropContainer = styled.div`
  height: 275px;
  border: 1px dashed var(--dashed-box);
  display: flex;
  flex: column nowrap;
  justify-content: center;
  align-content: center;
  background-color: var(--background);
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

const DropMessage = styled.h1`
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

function DropZone(): JSX.Element {
  return (
    <DropContainer>
      <DropMessage>
        Upload Your Images
        <UploadIcon />
        <Message>
          drop you image files or <br /> browse to choose a file
        </Message>
      </DropMessage>
    </DropContainer>
  );
}
export default DropZone;
