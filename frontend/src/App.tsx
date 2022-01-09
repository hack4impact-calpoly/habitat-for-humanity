import './App.css';
import React from 'react'

/* Screens */
// import ComponentName from './components/ComponentName/ComponentName';
// import LoginPage from "./components/LoginPage/LoginPage";
import DonatorNavbar from './components/DonatorNavbar/DonatorNavbar';
import DonationPage from './components/Donation/DonationPage';

function App(): JSX.Element {
  return (
    <body>
      <DonatorNavbar />
      <DonationPage />
    </body>
  );
}

export default App;
