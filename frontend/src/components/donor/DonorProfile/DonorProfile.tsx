import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import pencil from "images/pencil.png";
import { Auth } from "aws-amplify";
import { getUserByID } from "api/user";
import DonatorNavbar from "../DonorNavbar/DonorNavbar";

require("./DonorProfile.css");

function DonatorProfilePage(): JSX.Element {
  const [user, setUser] = useState<any>([]);

  useEffect(() => {
    async function getUser() {
      const userAuth = await Auth.currentUserInfo();
      console.log("userauth", userAuth);
      console.log("next");
      console.log(await Auth.currentAuthenticatedUser());
      const uid = userAuth.attributes["custom:id"];
      // userAuth.username
      const user = await getUserByID(uid);
      console.log(user);
      setUser(user);
    }
    getUser();
  }, []);

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
            <Link to={donatorProfileEditPath} id="edit">
              edit
            </Link>
          </div>
        </div>
        <div id="nameBox">
          <div className="headerBox">
            <p className="infoHeader">Name</p>
          </div>
          <div className="infoBox">
            {/* Need to implement displaying user data from backend */}
            <p id="name">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : ""}
            </p>
          </div>
        </div>
        <div id="emailBox">
          <div className="headerBox">
            <p className="infoHeader">Email</p>
          </div>
          <div className="infoBox">
            {/* Need to implement displaying user data from backend */}
            <p id="email">{user?.email}</p>
          </div>
        </div>
        <div id="phoneBox">
          <div className="headerBox">
            <p className="infoHeader">Phone</p>
          </div>
          <div className="infoBox">
            {/* Need to implement displaying user data from backend */}
            <p id="phone">{user?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonatorProfilePage;
