import './App.css';
import React from 'react'
import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
// import awsconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import LoginPage from "./components/authentication/LoginPage/LoginPage";

/* Screens */
// import DonatorNavbar from './components/donator/DonatorNavbar/DonatorNavbar';
// import DonatorProfilePage from './components/donator/DonatorProfile/DonatorProfile';
// import DonatorHomePage from './components/donator/DonatorHomePage/DonatorHomePage';
// import CreateAccountPage from './components/CreateAccountPage/CreateAccountPage';
// import DonatorProfileEditPage from './components/donator/DonatorProfileEditPage/DonatorProfileEditPage';
import DonatorLocationPage from './components/donator/DonationLocationPage/DonatorLocationPage';
//import DonatorNextStepsPage from './components/donator/DonatorNextStepsPage/DonatorNextStepsPage';

import SubmitDropOffPage from './components/donator/donation/SubmitDropOffPage/SubmitDropOffPage';
import SubmitPickUpPage from './components/donator/donation/SubmitPickUpPage/SubmitPickUpPage';
import SubmitPickUpMultiplePhotoPage from './components/donator/donation/SubmitPickUpMultiplePhotoPage/SubmitPickUpMultiplePhotoPage';
// import DonatorLocationPage from './components/donator/DonationLocationPage/DonatorLocationPage';
// import DonatorNextStepsPage from './components/donator/DonatorNextStepsPage/DonatorNextStepsPage';
// import Donation from './components/donator/Donation/Donation';
// Amplify.configure(awsconfig);


function App(): JSX.Element {
  return (
    <LoginPage />
    //<DonatorHomePage />
    //<CreateAccountPage />
    // <DonatorProfileEditPage />
    //<DonatorLocationPage />
    // <LoginPage />
    //<DonatorNextStepsPage />]

    //<SubmitDropOffPage />
    //<SubmitPickUpPage />
    //<SubmitPickUpMultiplePhotoPage />
    //<DonatorNextStepsPage />
  );
}

// export default withAuthenticator(App);
export default App;
