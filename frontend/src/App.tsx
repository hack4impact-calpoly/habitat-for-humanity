import './App.css';
import React from 'react'
import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
import awsconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import LoginPage from "./components/LoginPage/LoginPage";
Amplify.configure(awsconfig);

/* Screens */
// import ComponentName from './components/ComponentName/ComponentName';
// import DonatorNavbar from './components/DonatorNavbar/DonatorNavbar';
// import DonatorProfilePage from './components/DonatorProfile/DonatorProfile';
// import DonatorHomePage from './components/DonatorHomePage/DonatorHomePage';
// import CreateAccountPage from './components/CreateAccountPage/CreateAccountPage';
// import DonatorProfileEditPage from './components/DonatorProfileEditPage/DonatorProfileEditPage';
// import DonatorLocationPage from './components/DonationLocationPage/DonatorLocationPage';
// import DonatorNextStepsPage from './components/DonatorNextStepsPage/DonatorNextStepsPage';
// import Donation from './components/Donation/Donation';



function App(): JSX.Element {
  return (
    <LoginPage />
    //<DonatorHomePage />
    //<CreateAccountPage />
    // <DonatorProfileEditPage />
    // <DonatorLocationPage />
    // <LoginPage />
    //<DonatorNextStepsPage />
  );
}

export default withAuthenticator(App);
