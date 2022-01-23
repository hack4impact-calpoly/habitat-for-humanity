import React from "react";
import DonatorNavbar from "../DonatorNavbar/DonatorNavbar";
require("./DonatorLocationPage.css");

const DonatorLocationPage = (): JSX.Element => {
    const [address, setAddress] = React.useState<string>("");
    const [city, setCity] = React.useState<string>("")
    const [zip, setZip] = React.useState<number>(0);

    const nextOnClickDonatorLocation = () => {
        console.log(address, city, zip);

        if (address.length === 0 || city.length === 0) {
            alert("One or more of the inputs are incomplete. Please try again.");
        }
        else if(!(zip >= 1000 && zip <= 99999)) {
            alert("Please enter a valid 5 digit zip code.");
        }
        // else {
        //     redirect to next page
        // }
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
                    <button className="backButton">Back</button>
                    <button className="nextButton"onClick={() => nextOnClickDonatorLocation()}>Next</button>
                </div>
            </div>
        </body>
    )
}

export default DonatorLocationPage;