import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import DonatorNavbar from 'components/donor/DonorNavbar/DonorNavbar';
import ProgressBar from 'components/donor/donation/ProgressBar';

import { useDispatch, useSelector } from 'react-redux';
import { updateAddress, updateCity, updateZip } from "redux/donationSlice";
import { RootState } from '../../../redux/store'
require("./SubmitInfo.css");

interface DummyComponentProps {
    name?: string;
    dimensions?: string;
    photos?: {src: string}[];
    location?: string;
    dropOff?: boolean;
    component?: boolean;
  }

const SubmitInfo: React.FC<DummyComponentProps> = ({
    name,
    dimensions,
    photos,
    location,
    dropOff,
    component,
  }) => 
  {
    const storedName = useSelector((state: RootState) => state.donation.name);
    const storedDimensions = useSelector((state: RootState) => state.donation.dimensions);
    const storedLocation = useSelector((state: RootState) => state.donation.address);
    const storedDropOff = useSelector((state: RootState) => state.donation.dropoff);

    name = storedName;
    dimensions = storedDimensions;
    location = storedLocation;
    dropOff = storedDropOff;

    const [dropOffOption, setDropOffOption] = useState(dropOff);
    let navigate = useNavigate();

    const buttonNavigation = (e : React.MouseEvent<HTMLButtonElement>) : void => {
        const backPath : string = "/Donor/Donate/ScheduleDropoffPickup";
        const nextPath : string = "/Donor/Donate/NextSteps";

        if(e.currentTarget.value === "backButton"){
            navigate(backPath);
        }
        else if(e.currentTarget.value === "nextButton"){
            navigate(nextPath);
        }
    }

    return (
        <div>
            {!component && <DonatorNavbar />}

            <div id={!component ? "MainContainer" : ""}>

                <div id="SubmitInfoPage">
                    <div id="information">
                        {!component && <ProgressBar activeStep={4}/>}
                        {/* <h2 id="Review">Review</h2>
                        <p>Please review your donation information before you submit.</p> */}
                        <h2 id="ItemInfo">Item Information</h2>
                        <p id="itemName"><b>Item Name:</b> {name}</p>
                        <p id="itemDimensions"><b>Item Dimensions: </b>{dimensions}</p>
                        <p id="itemPhotos"><b>Item Photos</b></p>
                        <div id="ProductImages">{photos?.map((imgSrc, index) => (<div key={index} id="SingleImages"><img src={imgSrc.src} alt="n"/></div>))}</div>
                        <h2 id="Location">Location</h2>
                        <h4 id="Address">{location}</h4>
                    </div>
                    <div id="SchedulingInfo">
                        <h2 id="Scheduling">Scheduling</h2>
                        <h4 id="SchdulingDesc">Does the donation need to be picked up or can you drop it off at our ReStore?</h4>
                    </div>
                    <div id="donPDOptions">
                        <div>
                            <input type="radio" className="radioOptionLabelCircle" checked={dropOff} onChange={() => setDropOffOption(true)}/>
                            <p id="radioDropoff" className="radioOptionLabel radioLabel">I can drop off at the ReStore</p>
                        </div>
                        <div id="radioPickUp">
                            <input type="radio" className="radioOptionLabelCircle" checked={!dropOff} onChange={() => setDropOffOption(false)}/>
                            <p className="radioOptionLabel radioLabel">I need the item to be picked up</p>
                        </div>
                    </div>
                    {!component && <div id="donPickupButtons" style={{ display: 'flex', flexDirection: 'row' }}>
                        <button value="backButton" className="donPickupButton backButton" onClick={buttonNavigation}>Back</button>
                        <div style={{ flexGrow: 1 }} />
                        <button value="nextButton" className="donPickupButton nextButton" onClick={buttonNavigation}>Next</button>
                    </div>}
                </div>
            </div>
        </div>

    );
  };


export default SubmitInfo;
