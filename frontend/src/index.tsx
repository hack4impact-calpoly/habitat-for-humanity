import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// React Router Imports
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

// Component imports for navigation
import CreateAccount from "./components/authentication/CreateAccountPage/CreateAccountPage";
import ForgotPassword from "./components/authentication/ForgotPasswordPage/ForgotPasswordPage";

//-----------Donator Imports------------//
import DonatorHome from "./components/donator/DonatorHomePage/DonatorHomePage";
// Donator Make A Donation Imports
import DonatorLocation from "./components/donator/DonatorLocationPage/DonatorLocationPage";
// import DonatorScheduleDropoff from "./components/donator/DonatorScheduleDropoffPickupPage/DonatorScheduleDropoff";
import DonatorScheduleDropoffPickup from "./components/donator/DonatorScheduleDropoffPickupPage/DonatorScheduleDropoffPickupPage";
import DonatorNextSteps from "./components/donator/DonatorNextStepsPage/DonatorNextStepsPage";
// Donator Profile Imports
import DonatorProfile from "./components/donator/DonatorProfile/DonatorProfile";
import DonatorProfileEdit from "./components/donator/DonatorProfileEditPage/DonatorProfileEditPage";


const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <Routes>
      {/* Universal Routes */}
      <Route path="/" element={<App />} /> {/* Login page */}
      <Route path="/CreateAccount"  element={<CreateAccount />} />
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
              <Route path="Location" element={<DonatorLocation />} />
              {/* <Route path="iteminfo" element={}} */}
              <Route path="ScheduleDropoffPickup" element={<DonatorScheduleDropoffPickup />} />
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
    1. Donator
    2. Admin 
    3. Volunteer
  Subroutes: Page Components (Ex: not navbars) for the user
    1. Home
    2. Profile
    3. Profile/Edit
    2. etc.
  Corresponding Example URLs:
    domain/Donator/NextSteps
    domain/Admin/Home
    domain/Volunteer/Profile
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
