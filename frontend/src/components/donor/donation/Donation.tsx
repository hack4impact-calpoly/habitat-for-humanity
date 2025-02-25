import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDimensions,
  updateName,
  updatePhotos,
} from "redux/donationSlice";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "../../../redux/store";
import DonatorNavbar from "../DonorNavbar/DonorNavbar";
import Dropzone from "./Dropzone";
import ProgressBar from "./ProgressBar";

const ContentContainer = styled.div`
  margin-left: 20%;
  margin-right: 20%;

  @media only screen and (max-width: 640px) {
    margin-left: 10%;
    margin-right: 10%;
  }
`;

const DonationHeader = styled.h1`
  display: flex;
  justify-content: left;
  color: var(--primary);
  font-size: 28px;
  margin-top: 3em;
  margin-bottom: 1em;

  @media only screen and (max-width: 640px) {
    margin-top: 1em;
    font-size: 24px;
    margin-bottom: 0px;
  }
`;

const ItemHeader = styled.h1`
  display: flex;
  justify-content: left;
  color: var(--red);
  font-size: 30px;

  @media only screen and (max-width: 640px) {
    margin-bottom: 15px;
  }
`;

const InputSectionContainer = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;

  @media only screen and (max-width: 640px) {
    gap: 0px;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;
const StyledInput = styled.input`
  width: 100%;
  height: 45px;
  border: 1px solid var(--input-box);
`;
const SubHeader = styled.h1`
  font-size: 20px;
  margin-top: 1em;
  @media only screen and (max-width: 640px) {
    margin-bottom: 0em;
    margin-top: 0em;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 50%;
  margin-bottom: 1em;
  @media only screen and (max-width: 640px) {
    width: 100%;
  }
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

function Donation(): JSX.Element {
  const storedDesc = useSelector((state: RootState) => state.donation.name);
  const storedPhotos = useSelector((state: RootState) => state.donation.photos);
  const [itemDescription, setItemDescription] = useState<string[]>([]);
  const [itemDimensions, setItemDimensions] = useState<string[]>([]);
  const [photos, setPhotos] = useState(storedPhotos);
  const [descError, setDescError] = useState("");
  const [dimError, setDimError] = useState("");
  const [labels, setLabels] = useState<string[]>([""]);
  const [labelError, setLabelsError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const nextPath: string = "/Donor/Donate/Location";

    if (e.currentTarget.value === "nextButton") {
      if (validInput()) {
        updateStore();
        navigate(nextPath);
      }
    }
  };

  const validInput = () => {
    const valid = true;
    setDescError("");
    setDimError("");
    setLabelsError("");

    return valid;
  };

  const updateStore = () => {
    dispatch(updateName(itemDescription));
    dispatch(updateDimensions(itemDimensions));
    dispatch(updatePhotos(photos));
  };

  const [items, setItems] = useState([
    { name: "", description: "", dimensions: "" },
  ]);
  const addNewItem = () => {
    setItems([...items, { name: "", description: "", dimensions: "" }]);
  };

  const dropzoneProps = {
    photos,
    setPhotos,
  };

  const handleAddLabel = () => {
    setLabels([...labels, ""]);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedDescription = [...itemDescription];
    updatedDescription[index] = event.target.value;
    setItemDescription(updatedDescription);
  };
  const handleDimensionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedDimensions = [...itemDimensions];
    updatedDimensions[index] = event.target.value;
    setItemDimensions(updatedDimensions);
  };

  return (
    <>
      <DonatorNavbar />
      <ContentContainer>
        <DonationHeader>Make a donation</DonationHeader>
        <ProgressBar activeStep={1} />
        <ItemHeader>Item Information</ItemHeader>
        {labels.map((label, index) => (
          <InputSectionContainer key={index}>
            <InputContainer>
              <SubHeader>Item Description/Name</SubHeader>
              <StyledInput
                type="text"
                value={itemDescription[index]}
                onChange={(event) => handleDescriptionChange(event, index)}
              />
              <div className="inputError">{descError}</div>
            </InputContainer>
            <InputContainer>
              <SubHeader>Item Dimensions</SubHeader>
              <StyledInput
                type="text"
                value={itemDimensions[index]}
                onChange={(event) => handleDimensionChange(event, index)}
              />
              <div className="inputError">{dimError}</div>
            </InputContainer>
          </InputSectionContainer>
        ))}
        <button type="button" onClick={handleAddLabel}>
          Add Another Item
        </button>
        <UploadContainer>
          <SubHeader>Item Photos</SubHeader>
          <Dropzone {...dropzoneProps} />
        </UploadContainer>

        <div id="donPickupButtons">
          <button
            type="button"
            value="nextButton"
            className="donPickupButton nextButton"
            onClick={buttonNavigation}
          >
            Next
          </button>
        </div>
      </ContentContainer>
    </>
  );
}

export default Donation;
