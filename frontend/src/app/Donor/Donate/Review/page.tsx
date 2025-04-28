// app/Donor/Donate/Review/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDonorID } from "../../../../redux/donationSlice";
import { useRouter } from "next/navigation";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import ProgressBar from "components/donor/donation/ProgressBar";
import { Item, addItem } from "../../../../api/item";
import { addImages } from "../../../../api/image";
import { RootState } from "../../../../redux/store";
import { useUser } from "@clerk/clerk-react";
import { getUserByID } from "api/user";
import { getFiles, clearFiles } from "../../../../../utils/FileStore";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 20%;
  @media (max-width: 640px) {
    padding: 0 10%;
  }
`;

const Section = styled.div`
  margin-bottom: 2em;
`;

const ProductImages = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ReviewPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useUser();
  const storedDonation = useSelector((s: RootState) => s.donation);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");

  // 1) update donorID & fetch user info
  useEffect(() => {
    if (user?.id) {
      dispatch(updateDonorID(user.id));
      getUserByID(user.id).then((resp) => {
        setUserData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          phone: resp.phone || "",
        });
      });
    }
  }, [user, dispatch]);

  // 2) build previews from FileStore
  const files: File[] = getFiles();
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  // 3) upload images & send donation
  const sendToDB = async (): Promise<boolean> => {
    try {
      let images: String[] = [];
      if (files.length > 0) {
        const ts = Date.now();
        const uniqueFiles = files.map((file, idx) => {
          const ext = file.type.split("/")[1] || "jpg";
          return new File([file], `image-${ts}-${idx}.${ext}`, {
            type: file.type,
          });
        });
        // Convert String[] to string[] by mapping each String to string
        images = await addImages(uniqueFiles);
      }

      const donation: Item = {
        name: storedDonation.name,
        size: storedDonation.dimensions,
        images,
        address: storedDonation.address,
        city: storedDonation.city,
        state: storedDonation.state,
        zipCode: storedDonation.zipCode.toString(),
        donorId: storedDonation.donorID,
        timeApproved: new Date(),
        scheduling: storedDonation.dropoff ? "Dropoff" : "Pickup",
        timeAvailability: storedDonation.pickupTimes,
        timeSubmitted: new Date(),
        status: "Needs Approval",
      };
      console.log(images);
      const ok = await addItem(donation);
      if (!ok) {
        setServerError("Error sending donation. Please try again.");
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      setServerError("Error sending donation. Please try again.");
      return false;
    }
  };

  const handleClick = async (value: string) => {
    if (value === "back") {
      router.push("/Donor/Donate/ScheduleDropoffPickup");
    } else if (value === "next") {
      if (await sendToDB()) {
        router.push("/Donor/Donate/NextSteps");
      }
    }
  };

  return (
    <Container>
      <DonatorNavbar />
      <ProgressBar activeStep={4} />

      <Section>
        <h2>Contact Information</h2>
        <p>
          <b>Name:</b> {userData.firstName} {userData.lastName}
        </p>
        <p>
          <b>Email:</b> {userData.email}
        </p>
        <p>
          <b>Phone:</b> {userData.phone}
        </p>
      </Section>

      <Section>
        <h2>Item Information</h2>
        <p>
          <b>Name:</b> {storedDonation.name}
        </p>
        <p>
          <b>Dimensions:</b> {storedDonation.dimensions}
        </p>
        <p>
          <b>Photos:</b>
        </p>
        <ProductImages>
          {imageUrls.map((url, idx) => (
            <img key={idx} src={url} alt={`preview-${idx}`} />
          ))}
        </ProductImages>
      </Section>

      <Section>
        <h2>Location</h2>
        <p>
          {storedDonation.address}, {storedDonation.city},{" "}
          {storedDonation.state} {storedDonation.zipCode}
        </p>
      </Section>

      <div className="inputError">{serverError}</div>

      <ButtonRow>
        <button onClick={() => handleClick("back")}>Back</button>
        <button onClick={() => handleClick("next")}>Next</button>
      </ButtonRow>
    </Container>
  );
};

export default ReviewPage;
