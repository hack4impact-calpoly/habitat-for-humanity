import React from "react";
require("./SubmitInfo.css");

interface DummyComponentProps {
    name: string;
    dimensions: string;
    photos: {src: string}[];
    location: string;
    dropOff: boolean;
  }

const SubmitInfo: React.FC<DummyComponentProps> = ({
    name,
    dimensions,
    photos,
    location,
    dropOff,
  }) => {
    return (
        <body>
            <div id="SubmitInfoPage">
                <div id = "information">
                    <h2 id="Review">Review</h2>
                    <p>Please review your donation information before you submit.</p>
                    <h2 id="ItemInfo">Item Information</h2>
                    <p id="itemName"><b>Item Name:</b> {name}</p>
                    <p id="itemDimensions"><b>Item Dimensions: </b>{dimensions}</p>
                    <p id="itemPhotos"><b>Item Photos</b></p>
                    <div id="ProductImages">{photos.map((imgSrc, index) => (<div id="SingleImages"><img src={imgSrc.src} key={index} alt="n"/></div>))}</div>
                    <h2 id="Location">Location</h2>
                    <h4 id="Address">{location}</h4>
                </div>
                <div id="SchedulingInfo">
                    <h2 id="Scheduling">Scheduling</h2>
                    <h4 id="SchdulingDesc">Does the donation need to be picked up or can you drop it off at our ReStore?</h4>
                </div>
                <div id="donPDOptions">
                    <div>
                        <input type="radio" className="radioOptionLabelCircle" checked= {dropOff} />
                        <p id="radioDropoff" className="radioOptionLabel radioLabel">I can drop off at the ReStore</p>
                    </div>
                    <div id="radioPickUp">
                        <input type="radio" className="radioOptionLabelCircle" checked={!dropOff} />
                        <p className="radioOptionLabel radioLabel">I need the item to be picked up</p>
                    </div>
                </div>
            </div>
        </body>
    );
  };


export default SubmitInfo;