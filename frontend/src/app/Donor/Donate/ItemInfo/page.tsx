"use client";

import React, { useState } from "react";
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

function Donation(): React.ReactNode {
  const storedDesc = useSelector((state: RootState) => state.donation.name);
  const storedDims = useSelector(
    (state: RootState) => state.donation.dimensions,
  );
  const storedPhotos = useSelector((state: RootState) => state.donation.photos);
  const [items, setItems] = useState([{ description: "", dimensions: "" }]);
  //const [itemDescription, setItemDescription] = useState<string[]>([]);
  //const [itemDimensions, setItemDimensions] = useState<string[]>([]);
  const [photos, setPhotos] = useState(storedPhotos);
  const [descError, setDescError] = useState("");
  const [dimError, setDimError] = useState("");
  //const [labels, setLabels] = useState<string[]>([""]);
  const router = useRouter();
  const dispatch = useDispatch();

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
    setDescError("");
    setDimError("");

    for (let i = 0; i < items.length; i++) {

      if (!items[i].description.match(/\S/)) {
        setDescError("Please enter an item description");
        valid = false;
      }
      if (!items[i].dimensions.match(/\S/)) {
        setDimError("Please enter item dimensions");
        valid = false
      }
    }

    // itemDescription?.forEach((item) => {
    //   if (!item.match(/\S/)) {
    //     setDescError("Please enter an item description");
    //     valid = false
    //   }
    // });

    // itemDimensions?.forEach((item) => {
    //   if (!item.match(/\S/)) {
    //     setDimError("Please enter item dimensions");
    //     valid = false
    //   }
    // });

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
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
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
          <InputSectionContainer key={index}>
            <InputContainer>
              <SubHeader>Item Description/Name</SubHeader>
              <StyledInput
                type="text"
                value={items[index].description}
                onChange={(event) => handleDescriptionChange(event, index)}
              />
              <div className="inputError">{descError}</div>
            </InputContainer>
            <InputContainer>
              <SubHeader>Item Dimensions</SubHeader>
              <StyledInput
                type="text"
                value={items[index].dimensions}
                onChange={(event) => handleDimensionChange(event, index)}
              />
              <div className="inputError">{dimError}</div>
            </InputContainer>
            <button
              type="button"
              className="donPickupButton nextButton"
              onClick={() => handleRemoveItem(index)}
            >
              Remove Item
            </button>
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
