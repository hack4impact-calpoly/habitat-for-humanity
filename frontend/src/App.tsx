import './App.css';
import React from 'react'

/* Screens */
// import ComponentName from './components/ComponentName/ComponentName';
// import LoginPage from "./components/LoginPage/LoginPage";
// import DonatorNavbar from './components/DonatorNavbar/DonatorNavbar';
import DonatorHomePage from './components/DonatorHomePage/DonatorHomePage';
import CreateAccountPage from './components/CreateAccountPage/CreateAccountPage';
import Donation from './components/Donation/Donation';


function App(): JSX.Element {
  return (
    // <LoginPage />
    // <DonatorHomePage />
    // <CreateAccountPage />
    <Donation/>
  );
}

export default App;
