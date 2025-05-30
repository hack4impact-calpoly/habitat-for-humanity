"use client";

import ProgressBar from "components/donor/donation/ProgressBar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  updateAddress,
  updateCity,
  updateZip,
} from "../../../../redux/donationSlice";

import { RootState, store } from "../../../../redux/store";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import { useAuth } from "@clerk/nextjs";
import { getUserByID } from "api/user";

require("../../../../App.css");

function DonatorLocationPage(): React.ReactNode {
  const { userId } = useAuth();
  const storedAddr = useSelector((state: RootState) => state.donation.address);
  const storedCity = useSelector((state: RootState) => state.donation.city);
  const storedZip = useSelector((state: RootState) => state.donation.zipCode);
  const [address, setAddress] = useState<string>(storedAddr);
  const [city, setCity] = useState<string>(storedCity);
  const [zip, setZip] = useState<number>(storedZip);

  const [addrError, setAddrError] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");
  const [zipError, setZipError] = useState<string>("");

  const router = useRouter();
  const dispatch = useDispatch();

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const backPath: string = "/Donor/Donate/ItemInfo";
    const nextPath: string = "/Donor/Donate/ScheduleDropoffPickup";

    updateStore();
    if (e.currentTarget.value === "backButton") {
      router.push(backPath);
    } else if (e.currentTarget.value === "nextButton") {
      if (validInput()) {
        router.push(nextPath);
      }
    }
  };

  const fillAddress = async () => {
    if (userId) {
      const { address: userAddress = {} } = await getUserByID(userId);
      const { street, city, zip } = userAddress;

      street ? setAddress(street) : setAddrError("Street address not found");
      city ? setCity(city) : setCityError("City not found");
      zip ? setZip(zip) : setZipError("ZIP code not found");
    }
  };

  useEffect(() => {
    if (!(storedAddr || storedCity || storedZip)) fillAddress();
  }, [userId])

  const validInput = () => {
    let valid = true;
    setCityError("");
    setAddrError("");
    setZipError("");
    if (!city?.match(/\S/)) {
      setCityError("Please enter a city");
      valid = false;
    }
    if (!address?.match(/\S/)) {
      setAddrError("Please enter an address");
      valid = false;
    }
    if (zip < 10000 || zip > 99999) {
      setZipError("Please enter a 5 digit zip code");
      valid = false;
    }
    return valid;
  };

  const updateStore = () => {
    dispatch(updateAddress(address));
    dispatch(updateCity(city));
    dispatch(updateZip(zip));
  };

  return (
    <div>
      <DonatorNavbar />
      <div id="donLocPage">
        <ProgressBar activeStep={2} />
        <h1 id="donLocHeader">Location</h1>
        <div id="donLocTopInputs">
          <div>
            <p className="inputLabel">Address</p>
            <input
              className="donLocInput"
              type="text"
              value={address}
              onChange={(event) => setAddress(event?.target?.value)}
            />
            <div className="inputError">{addrError}</div>
          </div>
          <div>
            <p className="inputLabel">City</p>
            <input
              className="donLocInput"
              type="text"
              value={city}
              onChange={(event) => setCity(event?.target?.value)}
            />
            <div className="inputError">{cityError}</div>
          </div>
        </div>
        <div id="docLocBottomInputs">
          <p className="inputLabel">Zip Code</p>
          <input
            className="donLocInput"
            type="number"
            value={zip === 0 ? "" : zip}
            onChange={(event) =>
              setZip(Number(event?.target?.value.slice(0, 5)))
            }
          />
          <div className="inputError">{zipError}</div>
        </div>
        <div id="docLocButtons">
          <button
            type="button"
            value="backButton"
            className="backButton"
            onClick={buttonNavigation}
          >
            Back
          </button>
          <button
            type="button"
            value="nextButton"
            className="nextButton"
            onClick={buttonNavigation}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonatorLocationPage;
