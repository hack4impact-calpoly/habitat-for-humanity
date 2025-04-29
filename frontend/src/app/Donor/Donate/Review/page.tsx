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

require("../../../../App.css");

interface DummyComponentProps {
  name?: string[];
  dimensions?: string[];
  photos?: string[];
  location?: string;
  dropOff?: boolean;
  component?: boolean;
}

// TODO: eventually use DonorScheduleDropoff/Pickup pages instead of this component
const SubmitInfo: React.FC<DummyComponentProps> = ({
  name,
  dimensions,
  photos,
  location,
  dropOff,
  component,
}) => {

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const storedDonation = useSelector((state: RootState) => state.donation);
  const { user } = useUser();
  const storedName = useSelector((state: RootState) => state.donation.name);
  const storedDimensions = useSelector(
    (state: RootState) => state.donation.dimensions,
  );
  const statePhotos = useSelector((state: RootState) => state.donation.photos);

  // storedPhotos is an array of images names,
  // if access is needed, images name can be used
  // to generate presigned urls.
  const storedPhotos = statePhotos.map((url) => {
    const parts = url.split("/");
    return parts[parts.length - 1].split("?")[0];
  });
  const storedLocation = useSelector(
    (state: RootState) => state.donation.address,
  );
  const storedDropOff = useSelector(
    (state: RootState) => state.donation.dropoff,
  );
  const storedEvents = useSelector(
    (state: RootState) => state.donation.pickupTimes,
  );

  name = storedName;
  dimensions = storedDimensions;
  photos = storedPhotos;
  location = storedLocation;
  dropOff = storedDropOff;

  const [dropOffOption, setDropOffOption] = useState(dropOff);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

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

  const buttonNavigation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    const backPath: string = "/Donor/Donate/ScheduleDropoffPickup";
    const nextPath: string = "/Donor/Donate/NextSteps";

    if (e.currentTarget.value === "backButton") {
      router.push(backPath);
    } else if (e.currentTarget.value === "nextButton") {
      if (await sendToDB()) {
        router.push(nextPath);
      }
    }
  };


  return (
    <div>
      {!component && <DonatorNavbar />}
      <div id={!component ? "MainContainer" : ""}>
        <div id="SubmitInfoPage">
          <div id="information">
            {!component && <ProgressBar activeStep={4} />}
            <h2 id="Review">Review</h2>
            <p>Please review your donation information before you submit.</p>
            <h2 id="ItemInfo">Contact Information</h2>
            <p id="itemName">
              <b>Name:</b> {userData.firstName} {userData.lastName}
            </p>
            <p id="itemDimensions"><b>Email: </b> {userData.email}</p>
            <p id="itemPhotos"><b>Phone Number: </b> {userData.phone} </p>
            <h2 id="ItemInfo">Item Information</h2>
            <p id="itemName">
              <b>Item Name(s):</b>{" "}
              {name.join(", ")}
            </p>
            <p id="itemDimensions">
              <b>Item Dimension(s): </b>
              {dimensions.join(", ")}
            </p>
            <p id="itemPhotos">
              <b>Item Photos</b>
            </p>
            <div id="ProductImages">
              {imageUrls.map((url, idx) => (
                <img key={idx} src={url} alt={`preview-${idx}`} id="ProductImage"/>
              ))}
            </div>
            <h2 id="Location">Location</h2>
            <h4 id="Address">
              {storedDonation.address} <br /> {storedDonation.city},{" "}
              {storedDonation.state} {storedDonation.zipCode}
            </h4>
          </div>
          <div className="inputError">{serverError}</div>
          {!component && (
            <div
              id="donPickupButtons"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <button
                type="button"
                value="backButton"
                className="donPickupButton backButton"
                onClick={buttonNavigation}
                style={{ padding: "10px 45px" }}
              >
                Back
              </button>
              <button
                type="button"
                value="nextButton"
                className="donPickupButton nextButton"
                onClick={buttonNavigation}
                style={{ padding: "10px 45px" }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitInfo;
