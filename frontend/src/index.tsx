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
import DonatorHome from "./components/DonatorHomePage/DonatorHomePage";

//import DonatorItemInfo
import DonatorLocation from "./components/DonatorLocationPage/DonatorLocationPage";
import DonatorScheduleDropoffPickup from "./components/DonatorScheduleDropoffPickupPage/DonatorScheduleDropoffPickupPage";
import DonatorNextSteps from "./components/DonatorNextStepsPage/DonatorNextStepsPage";

//import DonatorProfile
import DonatorProfileEdit from "./components/DonatorProfileEditPage/DonatorProfileEditPage";



const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} /> {/* Login page */}
      <Route path="/CreateAccount" element={<CreateAccount />} />

      <Route path="/Donator">
          <Route path="Home" element={<DonatorHome />} />
          <Route path="MakeADonation"> {/*Cleaner Hierarchy and Easy for Navbar Underline */}
              <Route path="Location" element={<DonatorLocation />} />
              <Route path="NextSteps" element={<DonatorNextSteps />} />
              <Route path="ScheduleDropoffPickup" element={<DonatorScheduleDropoffPickup />} />

              <Route path="*" element={<p>ERROR 404: Make A Donation Page Not Found</p>} />
          </Route>
          <Route path="ProfileEdit" element={<DonatorProfileEdit />} />
          {/* Replace Profile Edit when done
          <Route path="Profile" element={<DonatorProfile />}>
              <Route path="Edit" element={<DonatorProfileEdit />} />
              <Route path="*" element={<p>ERROR 404: Profile Page Not Found</p>}>
          </Route> 
          */}
          
          <Route path="*" element={<p>ERROR 404: Donator Page Not Found</p>} /> {/* Donator Catch all case -> Donator Home*/}
      </Route>

      <Route path="*" element={<App />} /> {/*Catch all case sends back to login*/}
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
