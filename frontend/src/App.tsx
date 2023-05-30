import "./App.css";
// import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { Amplify } from "aws-amplify";
import React from "react";

// import DonorScheduleDropoffPickupPage from "components/donor/DonorScheduleDropoffPickupPage/DonorScheduleDropoffPickupPage";
import ActiveDonationPage from "components/admin/ActiveDonationsPage/ActiveDonationsPage";

/* Authentication Screens */
// import CreateAccountPage from './components/authentication/CreateAccountPage/CreateAccountPage';
// import LoginPage from "./components/authentication/LoginPage/LoginPage";
// import CreateAccountPage from './components/CreateAccountPage/CreateAccountPage';
// import LoginPage from "./components/authentication/LoginPage/LoginPage";
// import DonorScheduleDropoffPickupPage from 'components/donor/DonorScheduleDropoffPickupPage/DonorScheduleDropoffPickupPage';
// import SuccessPage from './components/authentication/SuccessPage/SuccessPage';
/* Admin Screens */
// import Donation from "components/donor/donation/Donation";

// import DonationInfoPage from "./components/admin/DonationInfoPage/DonationInfoPage";
// import ActiveDonationPage from "components/admin/ActiveDonationsPage/ActiveDonationsPage";
/* Donator Screens */
// import DonatorNavbar from './components/donator/DonatorNavbar/DonatorNavbar';
// import DonatorProfilePage from './components/donator/DonatorProfile/DonatorProfile';
// import DonatorHomePage from './components/donator/DonatorHomePage/DonatorHomePage';
// import DonatorProfileEditPage from './components/donator/DonatorProfileEditPage/DonatorProfileEditPage';
// import DonatorLocationPage from './components/donator/DonationLocationPage/DonatorLocationPage';
// import DonatorNextStepsPage from './components/donator/DonatorNextStepsPage/DonatorNextStepsPage';
// import SubmitDropOffPage from './components/donor/donation/SubmitDropOffPage/SubmitDropOffPage';
// import SubmitPickUpPage from './components/donor/donation/SubmitPickUpPage/SubmitPickUpPage';
// import SubmitPickUpMultiplePhotoPage from './components/donor/donation/SubmitPickUpMultiplePhotoPage/SubmitPickUpMultiplePhotoPage';
// import DonatorLocationPage from './components/donator/DonationLocationPage/DonatorLocationPage';
// import DonatorNextStepsPage from './components/donator/DonatorNextStepsPage/DonatorNextStepsPage';
// import Donation from './components/donator/Donation/Donation';
// import DonorSchedulePickUp from './components/donor/DonorScheduleDropoffPickupPage/DonorSchedulePickUp';
import awsExports from "./aws-exports";
// import Amplify from '@aws-amplify/core';
// import { Auth } from '@aws-amplify/auth';
// import awsconfig from './aws-exports';
// import { withAuthenticator } from '@aws-amplify/ui-react';
/* Authentication Screens */
// import CreateAccountPage from './components/authentication/CreateAccountPage/CreateAccountPage';
import LoginPage from "./components/authentication/LoginPage/LoginPage";
// import CreateAccountPage from './components/CreateAccountPage/CreateAccountPage';
// import LoginPage from "./components/authentication/LoginPage/LoginPage";
// import VerifyAccountPage from 'components/authentication/VerifyAccountPage/VerifyAccountPage';

Amplify.configure(awsExports);

function App(): JSX.Element {
  return (
    // <SuccessPage />
    <LoginPage />
    // <DonatorHomePage />
    // <CreateAccountPage />
    // <DonorSchedulePickUp/>
    // <DonatorProfileEditPage />
    // <DonatorLocationPage />
    // <LoginPage />
    // <DonatorNextStepsPage />
    // <VerifyAccountPage />
    // <SubmitDropOffPage />
    // <SubmitPickUpPage />
    // <SubmitPickUpMultiplePhotoPage />
    // <DonatorNextStepsPage />
    // <DonorScheduleDropoffPickupPage />
    // <DonationInfoPage />
    // <ActiveDonationPage />
  );
}

// export default withAuthenticator(App);
export default App;
