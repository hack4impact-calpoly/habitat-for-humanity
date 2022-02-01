import React from 'react'
import { useNavigate } from 'react-router-dom';
import DonatorNavbar from '../DonatorNavbar/DonatorNavbar';
require("./DonatorNextStepsPage.css");

const DonatorNextStepsPage = (): JSX.Element => {
    let navigate = useNavigate();

    const buttonNavigation = (e : React.MouseEvent<HTMLButtonElement>) : void => {
        const backPath : string = ""; //TBD
        const nextPath : string = "/donator";
        
        if(e.currentTarget.value === "backButton"){
            navigate(backPath);
        }
        else if(e.currentTarget.value === "nextButton"){
            navigate(nextPath);
        }
    }

    return (
        <body>
            <DonatorNavbar />
            <div id="donNextStepsPage">
                <h2 id="donNextStepsHeader">Confirmation and Next Steps</h2>
                <p id="donNextStepsDesc">You have successfully submitted your donation form! Our staff will review your donation in the next few days. Please expect an email from us with updates regarding your donation pick up or drop off.</p>
                <p id="donNextStepsQuestions">If you have any questions or concerns, please contact us at </p>
                <a style={{ textDecoration: "none" }} href="tel: +8055468699"><p id="donNextStepsPhone">(805) 546-8699</p></a>
                {// TODO: Add links to next and back page
                }<div id="docLocButtons">
                    <button className="backButton">Back</button>
                    <button className="nextButton">Next</button>
                </div>
            </div>
        </body>
    )
}

export default DonatorNextStepsPage;