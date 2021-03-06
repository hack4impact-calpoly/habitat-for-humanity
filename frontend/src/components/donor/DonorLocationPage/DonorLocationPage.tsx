import React, { useState }from "react";
import { useNavigate } from "react-router-dom";
import DonatorNavbar from "../DonorNavbar/DonorNavbar";
import ProgressBar from 'components/donor/donation/ProgressBar';
require("./DonorLocationPage.css");

const DonatorLocationPage = (): JSX.Element => {
    const [address, setAddress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [zip, setZip] = useState<number>(0);

    let navigate = useNavigate();

    const buttonNavigation = (e : React.MouseEvent<HTMLButtonElement>) : void => {
        const backPath : string = "/Donor/Donate/ItemInfo";
        const nextPath : string = "/Donor/Donate/ScheduleDropoffPickup";
        
        if(e.currentTarget.value === "backButton"){
            navigate(backPath);
        }
        else if(e.currentTarget.value === "nextButton"){
            if(nextOnClickDonatorLocation()){
                navigate(nextPath);
            }
        }
    }

    const nextOnClickDonatorLocation = () => {
        console.log(address, city, zip);

        if (address.length === 0 || city.length === 0) {
            alert("One or more of the inputs are incomplete. Please try again.");
            return false;
        }
        else if(!(zip >= 1000 && zip <= 99999)) {
            alert("Please enter a valid 5 digit zip code.");
            return false;
        }
        return true;
    }

    return (
        <div>
            <DonatorNavbar />
            <div id="donLocPage">
                <ProgressBar activeStep={2}/>
                <h1 id="donLocHeader">Location</h1>
                <div id="donLocTopInputs">
                    <div>
                        <p className="inputLabel">Address</p>
                        <input className="donLocInput" type="text" onChange={(event) => setAddress(event?.target?.value)} />
                    </div>
                    <div>
                        <p className="inputLabel">City</p>
                        <input className="donLocInput" type="text" onChange={(event) => setCity(event?.target?.value)} />
                    </div>
                </div>
                <div id="docLocBottomInputs">
                    <p className="inputLabel">Zip Code</p>
                    <input className="donLocInput" type="number" onChange={(event) => setZip(Number(event?.target?.value))} />
                </div>
                <div id="docLocButtons">
                    <button value="backButton" className="backButton" onClick={buttonNavigation}>Back</button>
                    <button value="nextButton" className="nextButton"onClick={buttonNavigation}>Next</button>
                </div>
            </div>
        </div>
    )
}

export default DonatorLocationPage;