import React from "react";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// React Router Imports
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

//----------- Authentication Imports------------//
import CreateAccount from "./components/authentication/CreateAccountPage/CreateAccountPage";
import ForgotPassword from "./components/authentication/ForgotPasswordPage/ForgotPasswordPage";
import SuccessPage from "./components/authentication/SuccessPage/SuccessPage";

//----------- Donor Imports------------//
import DonatorHome from "./components/donor/DonorHomePage/DonorHomePage";
// Donor "Make A Donation" Imports
import DonatorItemInfo from "./components/donor/donation/Donation";
import DonatorLocation from "./components/donor/DonorLocationPage/DonorLocationPage";
import DonatorScheduleDropoffPickup from "./components/donor/DonorScheduleDropoffPickupPage/DonorScheduleDropoffPickupPage";
import DonatorReviewSubmit from "./components/donor/donation/SubmitInfo";
import DonatorNextSteps from "./components/donor/DonorNextStepsPage/DonorNextStepsPage";
// Donor "Profile" Imports
import DonatorProfile from "./components/donor/DonorProfile/DonorProfile";
import DonatorProfileEdit from "./components/donor/DonorProfileEditPage/DonorProfileEditPage";


const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={<App />} /> {/* Login page */}
      <Route path="/CreateAccount"  element={<CreateAccount />} />
      <Route path="/CreateAccount/Success" element={<SuccessPage />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />

      {/* Donor Specific Routes */}
      <Route path="/Donor">
          {/* Donor Home */}
          <Route path="" element={<DonatorHome />} />
          {/* Donor Profile Pages */}
          <Route path="Profile">
              <Route path=""      element={<DonatorProfile />} />
              <Route path="Edit"  element={<DonatorProfileEdit />} />
              <Route path="*"     element={<p>ERROR 404: Profile Page Not Found</p>} />
          </Route>
          {/* Donor Make a Donation Pages */}
          <Route path="Donate"> 
              <Route path="ItemInfo" element={<DonatorItemInfo />} />
              <Route path="Location" element={<DonatorLocation />} />
              {/* <Route path="iteminfo" element={}} */}
              <Route path="ScheduleDropoffPickup" element={<DonatorScheduleDropoffPickup />} />
              <Route path="Confirmation" element={<DonatorReviewSubmit />} />
              <Route path="NextSteps" element={<DonatorNextSteps />} />

              <Route path="*" element={<p>ERROR 404: Make A Donation Page Not Found</p>} />
          </Route>
          {/* Donor Catch all case -> Donor Error*/}
          <Route path="*" element={<p>ERROR 404: Donor Page Not Found</p>} /> 
      </Route>

      {/* Universal Catch all -> back to log in*/}
      <Route path="*" element={<App />} /> 

    </Routes>
  </BrowserRouter>,
  rootElement
);

/* ----------- Notes for future reference: --------------
  Main Routes: Different system users
    1. Donor
    2. Admin 
    3. Volunteer
  Subroutes:
    1. Home
    2. Profile
    3. Profile/Edit
    2. etc.
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
