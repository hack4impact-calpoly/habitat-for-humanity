import React from 'react';
import checkCircle from '../../../images/CheckCircle.png';
require("./SuccessPage.css")

const SuccessPage = (): JSX.Element => {
    return (
        <>
            <div id="successBox">
                <img id="checkCircle" src={checkCircle} alt="checkCircle" />
                <h1>Success</h1>
                <p>You have successfully signed up for an account.</p>
                <button id="successButton">Log In</button>
            </div>
        </>
    )
}

export default SuccessPage;