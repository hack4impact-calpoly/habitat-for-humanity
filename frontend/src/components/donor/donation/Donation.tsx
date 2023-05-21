import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateDimensions, updateName } from "redux/donationSlice";
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
  const storedDims = useSelector(
    (state: RootState) => state.donation.dimensions
  );
  const [itemDescription, setItemDescription] = useState(storedDesc);
  const [itemDimensions, setItemDimensions] = useState(storedDims);
  const [descError, setDescError] = useState("");
  const [dimError, setDimError] = useState("");

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

  const backButtonNavigation = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    const nextPath: string = "/Donor/Donate/Disclosure";
    navigate(nextPath);
  };

  const validInput = () => {
    let valid = true;
    setDescError("");
    setDimError("");
    if (!itemDescription?.match(/\S/)) {
      setDescError("Please enter an item description");
      valid = false;
    }
    if (!itemDimensions?.match(/\S/)) {
      setDimError("Please enter item dimensions");
      valid = false;
    }
    return valid;
  };

  const updateStore = () => {
    dispatch(updateName(itemDescription));
    dispatch(updateDimensions(itemDimensions));
  };

  return (
    <>
      <DonatorNavbar />
      <ContentContainer>
        <DonationHeader>Make a donation</DonationHeader>
        <ProgressBar activeStep={1} />
        <ItemHeader>Item Information</ItemHeader>
        <InputSectionContainer>
          <InputContainer>
            <SubHeader>Item Description/Name</SubHeader>
            <StyledInput
              type="text"
              value={itemDescription}
              onChange={(event) => {
                setItemDescription(event.target.value);
              }}
            />
            <div className="inputError">{descError}</div>
          </InputContainer>
          <InputContainer>
            <SubHeader>Item Dimensions</SubHeader>
            <StyledInput
              type="text"
              value={itemDimensions}
              onChange={(event) => {
                setItemDimensions(event.target.value);
              }}
            />
            <div className="inputError">{dimError}</div>
          </InputContainer>
        </InputSectionContainer>
        <UploadContainer>
          <SubHeader>Item Photos</SubHeader>
          <Dropzone />
        </UploadContainer>
        <div
          id="donPickupButtons"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "30px",
            marginTop: "30px",
          }}
        >
          <button
            type="button"
            value="backButton"
            className="donPickupButton backButton"
            onClick={backButtonNavigation}
          >
            Back
          </button>
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
