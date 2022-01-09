import React from "react";
import NextSteps from "./NextSteps/NextSteps"
require("./DonationPage.css")

const DonationPage = (): JSX.Element => {
	return (
		<body id="donationPage" className="donationPage">
			<div className="donationPageContainer">
				<span>This is a placeholder for the progress bar.</span>
				<NextSteps />
			</div>
		</body>
	)
}

export default DonationPage;