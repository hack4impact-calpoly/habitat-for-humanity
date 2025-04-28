// app/Donor/Donate/ItemInfo/page.tsx

"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDimensions, updateName } from "../../../../redux/donationSlice";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { RootState } from "../../../../redux/store";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import Dropzone from "components/donor/donation/Dropzone";
import ProgressBar from "components/donor/donation/ProgressBar";
// FileStore is under frontend/utils/FileStore.ts
import { setFiles, clearFiles } from "../../../../../utils/FileStore";

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
    margin-bottom: 0;
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
    gap: 0;
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
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-bottom: 1em;

  @media only screen and (max-width: 640px) {
    width: 100%;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2em 0;
`;

export default function ItemInfoPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const storedDesc = useSelector((state: RootState) => state.donation.name);
  const storedDims = useSelector((state: RootState) => state.donation.dimensions);

  const [itemDescription, setItemDescription] = useState<string>(storedDesc);
  const [itemDimensions, setItemDimensions] = useState<string>(storedDims);
  const [descError, setDescError] = useState<string>("");
  const [dimError, setDimError] = useState<string>("");

  const validInput = (): boolean => {
    let ok = true;
    setDescError("");
    setDimError("");

    if (!itemDescription.trim()) {
      setDescError("Please enter an item description");
      ok = false;
    }
    if (!itemDimensions.trim()) {
      setDimError("Please enter item dimensions");
      ok = false;
    }
    return ok;
  };

  const updateStore = (): void => {
    dispatch(updateName(itemDescription));
    dispatch(updateDimensions(itemDimensions));
  };

  const handleClick = (action: "back" | "next"): void => {
    if (action === "back") {
      router.push("/Donor/Donate/Disclosure");
    } else if (action === "next" && validInput()) {
      updateStore();
      router.push("/Donor/Donate/Location");
    }
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
              onChange={(e) => setItemDescription(e.target.value)}
            />
            <div className="inputError">{descError}</div>
          </InputContainer>

          <InputContainer>
            <SubHeader>Item Dimensions</SubHeader>
            <StyledInput
              type="text"
              value={itemDimensions}
              onChange={(e) => setItemDimensions(e.target.value)}
            />
            <div className="inputError">{dimError}</div>
          </InputContainer>
        </InputSectionContainer>

        <UploadContainer>
          <SubHeader>Item Photos</SubHeader>
          <Dropzone setFiles={setFiles} clearFiles={clearFiles} />
        </UploadContainer>

        <ButtonRow>
          <button onClick={() => handleClick("back")}>Back</button>
          <button onClick={() => handleClick("next")}>Next</button>
        </ButtonRow>
      </ContentContainer>
    </>
  );
}





