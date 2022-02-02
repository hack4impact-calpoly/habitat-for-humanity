import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// React Router Imports
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

// Component imports for navigation
import CreateAccount from "./components/CreateAccountPage/CreateAccountPage";
import ForgotPassword from "./components/ForgotPasswordPage/ForgotPasswordPage";

//-----------Donator Imports------------//
import DonatorHome from "./components/DonatorHomePage/DonatorHomePage";
// Donator Make A Donation Imports
import DonatorLocation from "./components/DonatorLocationPage/DonatorLocationPage";
import DonatorScheduleDropoff from "./components/DonatorScheduleDropoffPickupPage/DonatorScheduleDropoff";
import DonatorScheduleDropoffPickup from "./components/DonatorScheduleDropoffPickupPage/DonatorScheduleDropoffPickupPage";
import DonatorNextSteps from "./components/DonatorNextStepsPage/DonatorNextStepsPage";
// Donator Profile Imports
import DonatorProfile from "./components/DonatorProfile/DonatorProfile";
import DonatorProfileEdit from "./components/DonatorProfileEditPage/DonatorProfileEditPage";


const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <Routes>
      {/* Universal Routes */}
      <Route path="/" element={<App />} /> {/* Login page */}
      <Route path="/createaccount"  element={<CreateAccount />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      {/* Donator Specific Routes */}
      <Route path="/donator">
          {/* Donator Home */}
          <Route path="" element={<DonatorHome />} />
          {/* Donator Profile Pages */}
          <Route path="profile">
              <Route path=""      element={<DonatorProfile />} />
              <Route path="edit"  element={<DonatorProfileEdit />} />
              <Route path="*"     element={<p>ERROR 404: Profile Page Not Found</p>} />
          </Route>
          {/* Donator Make a Donation Pages */}
          <Route path="donate"> 
              <Route path="location" element={<DonatorLocation />} />
              {/* <Route path="iteminfo" element={}} */}
              <Route path="scheduleDropoffPickup" element={<DonatorScheduleDropoffPickup />} />
              <Route path="nextsteps" element={<DonatorNextSteps />} />

              <Route path="*" element={<p>ERROR 404: Make A Donation Page Not Found</p>} />
          </Route>
          {/* Donator Catch all case -> Donator Error*/}
          <Route path="*" element={<p>ERROR 404: Donator Page Not Found</p>} /> 
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
