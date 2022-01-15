import React from "react";
import DonatorNavbar from "../DonatorNavbar/DonatorNavbar";
require("./DonatorLocationPage.css");

const DonatorLocationPage = (): JSX.Element => {
    const [address, setAddress] = React.useState<string>("");
    const [city, setCity] = React.useState<string>("")
    const [zip, setZip] = React.useState<number>(0);

    const postDonatorLocation = () => {
        console.log(address, city, zip);
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
                    <button className="nextButton"onClick={() => postDonatorLocation()}>Next</button>
                </div>
            </div>
        </body>
    )
}

export default DonatorLocationPage;