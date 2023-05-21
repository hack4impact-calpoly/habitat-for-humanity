import React, { useEffect, useState } from "react";
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
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const checkIfMobileScreen = () => {
      const screenWidth = window.innerWidth;
      setIsMobileScreen(screenWidth <= 768); // Adjust the breakpoint as per your needs
    };

    checkIfMobileScreen();
    window.addEventListener("resize", checkIfMobileScreen);

    return () => {
      window.removeEventListener("resize", checkIfMobileScreen);
    };
  }, []);

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
        }}
      >
        <img
          src={donationGuidelines}
          alt="donation-guidelines"
          style={{ width: isMobileScreen ? "100vw" : "65vw" }}
        />
        <div style={{ width: isMobileScreen ? "90vw" : "70vw" }}>
          <h2
            style={{
              color: "#F23E16",
              fontSize: isMobileScreen ? "20px" : "25px",
            }}
          >
            Terms and Regulations
          </h2>
          <p style={{ fontSize: isMobileScreen ? "15px" : "17px" }}>
            Habitat for Humanity SLO County reserves the right to deny a
            donation upon arrival due to discrepancy of item based on provided
            description or photo received.
          </p>
          <p style={{ fontSize: isMobileScreen ? "15px" : "17px" }}>
            Unauthorized dumping of items is illegal under penal code 374.3
          </p>
        </div>
      </div>
      {/* checkbox */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: isMobileScreen ? "5vw" : "40vw",
          marginTop: "30px",
          marginRight: "15vw",
          fontSize: isMobileScreen ? "15px" : "17px",
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
          marginBottom: isMobileScreen ? "10px" : "30px",
          marginTop: "30px",
        }}
      >
        <button
          type="button"
          value="backButton"
          className="disclosureBackButton"
          onClick={BackRouteChange}
          style={{
            padding: "10px 45px",
            marginLeft: isMobileScreen ? "5vw" : "15vw",
          }}
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
            marginRight: isMobileScreen ? "5vw" : "15vw",
            border: checkboxChecked ? undefined : "2px solid transparent",
            backgroundColor: checkboxChecked ? undefined : "#CDCDCD",
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
