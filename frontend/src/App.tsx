import './App.css';
import React from 'react'
// import Amplify from '@aws-amplify/core';
// import { Auth } from '@aws-amplify/auth';
// import awsconfig from './aws-exports';
// import { withAuthenticator } from '@aws-amplify/ui-react';


/* Screens */
// import ComponentName from './components/ComponentName/ComponentName';
// import LoginPage from "./components/LoginPage/LoginPage";
import SuccessPage from './components/SuccessPage/SuccessPage';
// import DonatorNavbar from './components/DonatorNavbar/DonatorNavbar';
// import DonatorProfilePage from './components/DonatorProfile/DonatorProfile';
// import DonatorHomePage from './components/DonatorHomePage/DonatorHomePage';
// import CreateAccountPage from './components/CreateAccountPage/CreateAccountPage';
// import DonatorProfileEditPage from './components/DonatorProfileEditPage/DonatorProfileEditPage';
import DonatorLocationPage from './components/DonationLocationPage/DonatorLocationPage';
//import DonatorNextStepsPage from './components/DonatorNextStepsPage/DonatorNextStepsPage';

import SubmitDropOffPage from './components/donation/SubmitDropOffPage/SubmitDropOffPage';
import SubmitPickUpPage from './components/donation/SubmitPickUpPage/SubmitPickUpPage';
import SubmitPickUpMultiplePhotoPage from './components/donation/SubmitPickUpMultiplePhotoPage/SubmitPickUpMultiplePhotoPage';
// import DonatorLocationPage from './components/DonationLocationPage/DonatorLocationPage';
// import DonatorNextStepsPage from './components/DonatorNextStepsPage/DonatorNextStepsPage';
// import Donation from './components/Donation/Donation';
// Amplify.configure(awsconfig);


function App(): JSX.Element {
  return (
    <SuccessPage />
    // <LoginPage />
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
