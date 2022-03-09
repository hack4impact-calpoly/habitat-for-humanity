import React, { useState }from "react";
import { useNavigate } from "react-router-dom";
import DonatorNavbar from "../DonorNavbar/DonorNavbar";
require("./DonorLocationPage.css");

const DonatorLocationPage = (): JSX.Element => {
    const [address, setAddress] = useState<string>("");
    const [city, setCity] = useState<string>("")
    const [zip, setZip] = useState<number>(0);

    let navigate = useNavigate();

    const buttonNavigation = (e : React.MouseEvent<HTMLButtonElement>) : void => {
        const backPath : string = "/Donor"; //Change once page is added
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
        <body>
            <DonatorNavbar />
            <div id="donLocPage">
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
        </body>
    )
}

export default DonatorLocationPage;