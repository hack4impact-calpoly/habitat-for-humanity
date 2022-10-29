import React from "react";
import { useNavigate } from "react-router-dom";
import gift from "images/gift.png";
import { useDispatch, useSelector } from "react-redux";
import { clearAll } from "redux/donationSlice";
import DonatorNavbar from "../DonorNavbar/DonorNavbar";

require("./DonorHomePage.css");

function DonatorHomePage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const routeChange = (): void => {
    const donateLocationPath = "/Donor/Donate/ItemInfo";
    dispatch(clearAll());
    navigate(donateLocationPath);
  };

  return (
    <div id="donatePage">
      <DonatorNavbar />
      <div id="giftBox">
        <img id="donatePageGift" src={gift} alt="gift" />
        <h1 id="donatePageHeader">Welcome, make a donation!</h1>
        <p id="donatePageDesc">
          To schedule a pickup or drop off your donation, click below to enter
          information about the item for our staff to review.
        </p>
        <button type="button" id="donatePageButton" onClick={routeChange}>
          Make a Donation
        </button>
      </div>
    </div>
  );
}

export default DonatorHomePage;
