import React, { useState } from "react";
import DonatorNavbar from "../DonatorNavbar/DonatorNavbar";
import styled from 'styled-components';
import ProgressBar from './ProgressBar';
import Dropzone from './Dropzone';
import ProgressBarImage from './ProgressBar.png'

const ContentContainer = styled.div`
   margin-left: 20%;
   margin-right: 20%;
`;

const DonationHeader = styled.h1`
   display: flex;
   justify-content: left;
   color: var(--primary);
   font-size: 28px;
   margin-top: 3em;
   margin-bottom: 1em;
`;

const ItemHeader = styled.h1`
   display: flex;
   justify-content: left;
   color: var(--red);
   font-size: 30px;
`;

const InputSectionContainer = styled.div`
   display: flex;
   gap: 30px;
   justify-content: center;
   
`;
const StyledInput = styled.input`
   width: 100%;
   height: 45px;
   border: 1px solid var(--input-box);
`;
const SubHeader = styled.h1`
   font-size: 20px;
   margin-top: 1em;
`;

const InputContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 50%;
  margin-bottom: 1em;
`;
const UploadContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
`;
const StyledButton = styled.button`
   margin-top: 2em;
   margin-bottom: 2em;
   background-color: var(--button-blue);
   width: 20%;
   height: 3em;
   border: 1px solid var(--button-blue);
   font-size: 20px;
   color: var(--white);
`;


const Donation = (): JSX.Element => {
   const [itemDescription, setItemDescription] = useState("")
   const [itemDimensions, setItemDimensions] = useState("")
   return (
      <>
         <DonatorNavbar />
         <ContentContainer>
            <DonationHeader>Make a donation</DonationHeader>
            <img src={ProgressBarImage} width="100%"/>
            <ItemHeader>Item Information</ItemHeader>
            <InputSectionContainer>
               <InputContainer>
               
                  <SubHeader>Item Description/Name</SubHeader>
               <StyledInput
                  type="text"
                  value={itemDescription}
                  onChange={event => {
                     setItemDescription(event.target.value)
                  }}
                  
                     />
                  </InputContainer>
            <InputContainer>
               
                  <SubHeader>Item Dimensions</SubHeader>
               <StyledInput
                  type="text"
                  value={itemDimensions}
                  onChange={event => {
                     setItemDescription(event.target.value)
                  }}
                  
                     />
                  </InputContainer>
            </InputSectionContainer>
            <UploadContainer>
               <SubHeader>Item Photos</SubHeader>
               <Dropzone/>
            </UploadContainer>
            <StyledButton>Next</StyledButton>
         </ContentContainer>
      </>
   );
};
 
export default Donation;