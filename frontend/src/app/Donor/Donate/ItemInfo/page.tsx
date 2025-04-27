"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDimensions,
  updateName,
  updatePhotos,
} from "../../../../redux/donationSlice";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { RootState } from "../../../../redux/store";
import DonatorNavbar from "../../../../components/donor/DonorNavbar/DonorNavbar";
import Dropzone from "../../../../components/donor/donation/Dropzone";
import ProgressBar from "../../../../components/donor/donation/ProgressBar";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";

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
const StyledLabel = styled.label`
  font-size: 20px;
  margin-bottom: 0.5em;
  white-space: nowrap;
  @media only screen and (max-width: 640px) {
    margin-bottom: 0em;
    margin-top: 0em;
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

function Donation(): React.ReactNode {
  const storedDesc = useSelector((state: RootState) => state.donation.name);
  const storedDims = useSelector(
    (state: RootState) => state.donation.dimensions,
  );
  const storedPhotos = useSelector((state: RootState) => state.donation.photos);
  const [items, setItems] = useState([{ description: "", dimensions: "" }]);
  const [photos, setPhotos] = useState(storedPhotos);
  const [descError, setDescError] = useState([""]);
  const [dimError, setDimError] = useState([""]);
  const router = useRouter();
  const dispatch = useDispatch();

  // Auto-fill the input fields with stored values if they exist
  useEffect(() => {
    if (storedDesc && storedDims) {
      const autofilledItems = storedDesc.map(
        (description: string, index: number) => ({
          description,
          dimensions: storedDims[index] || "",
        }),
      );
      const descErrors = Array(storedDesc.length).fill("");
      const dimErrors = Array(storedDesc.length).fill("");
      setDescError(descErrors);
      setDimError(dimErrors);
      setItems(autofilledItems);
    }
  }, [storedDesc, storedDims]);

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const nextPath: string = "/Donor/Donate/Location";

    if (e.currentTarget.value === "nextButton") {
      if (validInput()) {
        updateStore();
        router.push(nextPath);
      }
    }
  };

  const validInput = () => {
    let valid = true;

    for (let i = 0; i < items.length; i++) {
      if (!items[i].description.match(/\S/)) {
        const newDescError = [...descError];
        newDescError[i] = "Please enter item description";
        setDescError(newDescError);
        valid = false;
      }
      if (!items[i].dimensions.match(/\S/)) {
        const newDimError = [...dimError];
        newDimError[i] = "Please enter item dimensions";
        setDimError(newDimError);
        valid = false;
      }
    }

    return valid;
  };

  const updateStore = () => {
    const itemDescription = items.map((item) => item.description);
    const itemDimensions = items.map((item) => item.dimensions);
    dispatch(updateName(itemDescription));
    dispatch(updateDimensions(itemDimensions));
    dispatch(updatePhotos(photos));
  };

  const dropzoneProps = {
    photos,
    setPhotos,
  };

  const handleAddItem = () => {
    setItems([...items, { description: "", dimensions: "" }]);
    setDescError([...descError, ""]);
    setDimError([...dimError, ""]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      const newDescError = [...descError];
      const newDimError = [...dimError];
      newItems.splice(index, 1);
      newDescError.splice(index, 1);
      newDimError.splice(index, 1);
      setItems(newItems);
      setDescError(newDescError);
      setDimError(newDimError);
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedItems = [...items];
    updatedItems[index].description = event.target.value;
    setItems(updatedItems);
  };

  const handleDimensionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedItems = [...items];
    updatedItems[index].dimensions = event.target.value;
    setItems(updatedItems);
  };

  return (
    <>
      <DonatorNavbar />
      <ContentContainer>
        <DonationHeader>Make a donation</DonationHeader>
        <ProgressBar activeStep={1} />
        <ItemHeader>Item Information</ItemHeader>
        {items.map((item, index) => (
          <InputSectionContainer key={index} className="itemInputContainer">
            <InputContainer>
              <StyledLabel htmlFor={`item-description-${index}`}>
                Item Description/Name
              </StyledLabel>
              <StyledInput
                type="text"
                id={`item-description-${index}`}
                value={item.description}
                onChange={(event) => handleDescriptionChange(event, index)}
              />
              <div className="inputError">{descError[index]}</div>
            </InputContainer>
            <InputContainer>
              <StyledLabel htmlFor={`item-dimension-${index}`}>
                Item Dimensions
              </StyledLabel>
              <StyledInput
                type="text"
                id={`item-dimension-${index}`}
                value={item.dimensions}
                onChange={(event) => handleDimensionChange(event, index)}
              />
              <div className="inputError">{dimError[index]}</div>
            </InputContainer>
            <div className="removeButtonContainer">
              <IconButton
                onClick={() => handleRemoveItem(index)}
                className="removeButton"
              >
                <Close className="crossIcon" />
              </IconButton>
            </div>
          </InputSectionContainer>
        ))}
        <button
          type="button"
          className="donPickupButton nextButton"
          onClick={handleAddItem}
        >
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
