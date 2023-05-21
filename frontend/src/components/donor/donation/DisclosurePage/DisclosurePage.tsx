import React, { useState } from "react";
import "./DisclosurePage.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAll } from "redux/donationSlice";
import DonatorNavbar from "../../DonorNavbar/DonorNavbar";
import donationGuidelines from "./donationGuidelines.png";

const DisclosurePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const BackRouteChange = (): void => {
    const donateLocationPath = "/Donor";
    dispatch(clearAll());
    navigate(donateLocationPath);
  };

  const NextRouteChange = (): void => {
    if (checkboxChecked) {
      const donateLocationPath = "/Donor/Donate/ItemInfo";
      dispatch(clearAll());
      navigate(donateLocationPath);
    }
  };

  const handleCheckboxChange = (): void => {
    setCheckboxChecked(!checkboxChecked);
  };

  return (
    <div>
      <DonatorNavbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "0px",
        }}
      >
        <img
          src={donationGuidelines}
          alt="donation-guidelines"
          style={{ width: "65vw" }}
        />
        <div style={{ width: "70vw" }}>
          <h2 style={{ color: "#F23E16" }}> Terms and Regulations </h2>
          <p>
            Habitat for Humanity SLO County reserves the right to deny a
            donation upon arrival due to discrepancy of item based on provided
            description or photo received.
          </p>
          <p>Unauthorized dumping of items is illegal under penal code 374.3</p>
        </div>
      </div>
      {/* checkbox */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: "40vw",
          marginTop: "30px",
          marginRight: "15vw",
        }}
      >
        <input type="checkbox" onChange={handleCheckboxChange} />
        <strong>
          I understand and agree to the Donation Guidelines and Terms and
          Regulations
        </strong>
      </div>
      {/* buttons */}
      <div
        className="buttonContainer"
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
          className="disclosureBackButton"
          onClick={BackRouteChange}
          style={{ padding: "10px 45px", marginLeft: "15vw" }}
        >
          Back
        </button>
        <button
          type="button"
          value="nextButton"
          className="disclosureNextButton"
          onClick={NextRouteChange}
          style={{
            padding: "10px 45px",
            marginRight: "15vw",
            border: checkboxChecked ? undefined : "2px solid transparent",
            backgroundColor: checkboxChecked ? undefined : "gray",
            cursor: checkboxChecked ? "pointer" : "not-allowed",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DisclosurePage;
