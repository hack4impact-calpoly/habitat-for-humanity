import React from "react";
require("./ContactInfo.css");

interface DummyComponentProps {
    name?: string;
    email?: string;
    phone?: string;
  }

const SubmitInfo: React.FC<DummyComponentProps> = ({
    name,
    email,
    phone,
  }) => 
  {
    return (
        <body>
            <div id="SubmitInfoPage">
                <div id = "information">
                    {/* <h2 id="Review">Review</h2>
                    <p>Please review your donation information before you submit.</p> */}
                    <h2 id="ContactInfo">Contact Information</h2>
                    <p id="Name"><b>Name:</b> {name}</p>
                    <p id="Email"><b>Email: </b>{email}</p>
                    <p id="Phone"><b>Phone: </b>{phone}</p>
                </div>
            </div>
        </body>
    );
  };


export default SubmitInfo;
