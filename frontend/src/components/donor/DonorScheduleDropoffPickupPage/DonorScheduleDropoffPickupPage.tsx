import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import DonatorNavbar from "../DonorNavbar/DonorNavbar";
import DonatorScheduleDropoff from "./DonorScheduleDropoff";
import DonatorSchedulePickUp from "./DonorSchedulePickUp";
import ProgressBar from 'components/donor/donation/ProgressBar';

import { useDispatch, useSelector } from 'react-redux';
import { updateDropoff } from "redux/donationSlice";
import { RootState } from '../../../redux/store'
require("./DonorScheduleDropoffPickupPage.css");

const DonatorScheduleDropoffPage = (): JSX.Element => {
    const storedDropoff = useSelector((state: RootState) => state.donation.dropoff);
    const [isDropoff, setIsDropoff] = useState<boolean>(storedDropoff)
    const dispatch = useDispatch();

    const flipDropoff = () => {
        dispatch(updateDropoff(!isDropoff));
        setIsDropoff(!isDropoff);
    }

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <DonatorNavbar />
            <div id="donDropoffPage">
                <ProgressBar activeStep={3}/>
                <div>
                    <h2 id="donPDHeader">Scheduling</h2>
                    <h4>Does the donation need to be picked up or can you drop it off at our ReStore?</h4>
                    <div id="donPDOptions">
                            <div>
                                <input type="radio" className="radioOptionLabel" onChange={() => flipDropoff()} checked={isDropoff} />
                                <p id="radioDropoff" className="radioOptionLabel radioLabel">I can drop off at the ReStore</p>
                            </div>
                            <div id="radioPickUp">
                                <input type="radio" className="radioOptionLabel" onChange={() => flipDropoff()} checked={!isDropoff} />
                                <p className="radioOptionLabel radioLabel">I need the item to be picked up</p>
                            </div>
                    </div>
                </div>
                {isDropoff ? <DonatorScheduleDropoff /> : 
                    <DonatorSchedulePickUp />}
            </div>
        </div>
    );
};

export default DonatorScheduleDropoffPage;
