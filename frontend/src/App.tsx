import './App.css';
import React from 'react'

/* Screens */
// import ComponentName from './components/ComponentName/ComponentName';
import LoginPage from "./components/LoginPage/LoginPage";
// import DonatorNavbar from './components/DonatorNavbar/DonatorNavbar';
import DonatorHomePage from './components/DonatorHomePage/DonatorHomePage';
import CreateAccountPage from './components/CreateAccountPage/CreateAccountPage';
import DonatorProfileEditPage from './components/DonatorProfileEditPage/DonatorProfileEditPage';

function App(): JSX.Element {
  return (
    //<LoginPage />
    //<DonatorHomePage />
    //<CreateAccountPage />
    <DonatorProfileEditPage />
  );
}

export default App;
