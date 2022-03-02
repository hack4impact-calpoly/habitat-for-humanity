import './App.css';
import React from 'react'

/* Screens */
// import ComponentName from './components/ComponentName/ComponentName';
// import LoginPage from "./components/LoginPage/LoginPage";
// import DonatorNavbar from './components/DonatorNavbar/DonatorNavbar';
import DonatorProfilePage from './components/donator/DonatorProfile/DonatorProfile';
// import DonatorHomePage from './components/DonatorHomePage/DonatorHomePage';
// import CreateAccountPage from './components/CreateAccountPage/CreateAccountPage';
import DonatorProfileEditPage from './components/donator/DonatorProfileEditPage/DonatorProfileEditPage';
import DonatorLocationPage from './components/donator/DonationLocationPage/DonatorLocationPage';
//import DonatorNextStepsPage from './components/DonatorNextStepsPage/DonatorNextStepsPage';
import DonatorProfile from './components/donator/DonatorProfile/DonatorProfile';
import SubmitDropOffPage from './components/donator/donation/SubmitDropOffPage/SubmitDropOffPage';
import SubmitPickUpPage from './components/donator/donation/SubmitPickUpPage/SubmitPickUpPage';
import SubmitPickUpMultiplePhotoPage from './components/donator/donation/SubmitPickUpMultiplePhotoPage/SubmitPickUpMultiplePhotoPage';


function App(): JSX.Element {
  return (
    //<LoginPage />
    //<DonatorHomePage />
    //<CreateAccountPage />
    //<DonatorProfileEditPage />
    <DonatorProfile />
    //<DonatorLocationPage />
    // <LoginPage />
    //<DonatorNextStepsPage />]

    //<SubmitDropOffPage />
    //<SubmitPickUpPage />
    //<SubmitPickUpMultiplePhotoPage />
  );
}

export default App;
