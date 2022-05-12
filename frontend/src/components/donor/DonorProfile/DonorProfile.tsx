import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DonatorNavbar from '../DonorNavbar/DonorNavbar';
import pencil from "images/pencil.png";
import { Auth } from "aws-amplify";
import { getUserByID } from 'api/user';



require("./DonorProfile.css");

const DonatorProfilePage = (): JSX.Element => {
    const [user, setUser] = useState<any>([]);

    useEffect(() => {
        async function getUser() {
            let userAuth = await Auth.currentUserInfo();
            let user = await getUserByID(userAuth.username);
            setUser(user);
        }
        getUser();
    }, [])
    
    const donatorProfileEditPath = "/Donor/Profile/Edit";

    return (
        <div>
            <DonatorNavbar />
            <div id="donatorProfileBox">
                <div id="headerBox">
                    <div id="profileBox">
                        <p id="profile">Profile</p>
                    </div>
                    <div id="editBox">
                        <img alt="pencil" id="pencil" src={pencil} />
                        {/* Need to Implement Link to DonatorProfileEditPage */}
                        <Link to={donatorProfileEditPath} id="edit">edit</Link>
                    </div>
                </div>
                <div id="nameBox">
                    <div className="headerBox">
                        <p className="infoHeader">Name</p>
                    </div>
                    <div className="infoBox">
                        {/* Need to implement displaying user data from backend */}
                        <p id="name">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}</p>
                    </div>
                </div>
                <div id="emailBox">
                    <div className="headerBox">
                        <p className="infoHeader">Email</p>
                    </div>
                    <div className="infoBox">
                        {/* Need to implement displaying user data from backend */}
                        <p id="email">{user.email}</p>
                    </div>
                </div>
                <div id="phoneBox">
                    <div className="headerBox">
                        <p className="infoHeader">Phone</p>
                    </div>
                    <div className="infoBox">
                        {/* Need to implement displaying user data from backend */}
                        <p id="phone">{user.phone}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DonatorProfilePage;