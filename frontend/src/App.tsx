import './App.css';
import React from 'react'

/* Screens */
// import ComponentName from './components/ComponentName/ComponentName';
import LoginPage from "./components/LoginPage/LoginPage";
// import DonatorNavbar from './components/DonatorNavbar/DonatorNavbar';
import DonatorHomePage from './components/DonatorHomePage/DonatorHomePage';
import DonatorProfilePage from './components/DonatorProfile/DonatorProfile';
// import CreateAccountPage from './components/CreateAccountPage/CreateAccountPage';
// import DonatorProfileEditPage from './components/DonatorProfileEditPage/DonatorProfileEditPage';
// import DonatorLocationPage from './components/DonationLocationPage/DonatorLocationPage';
// import DonatorNextStepsPage from './components/DonatorNextStepsPage/DonatorNextStepsPage';
// import DonatorScheduleDropoffPickupPage from './components/DonatorScheduleDropoffPickupPage/DonatorScheduleDropoffPickupPage';

function App(): JSX.Element {
  return (
    //<LoginPage />
    //<DonatorHomePage />
    //<CreateAccountPage />
    // <DonatorProfileEditPage />
    // <DonatorLocationPage />
    // <LoginPage />
    <DonatorProfilePage />
  );
}

export default App;
