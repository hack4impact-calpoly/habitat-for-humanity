import React from "react";
require("./NextSteps.css")

const NextSteps = (): JSX.Element => {
	return (
		<div id="nextSteps" className="nextSteps">
			<h2>Confirmation and Next Steps</h2>
			<p>You have successfully submitted your donation form! Our staff will review your donation in the next few days. Please expect an email from us with updates regarding your donation pick up or drop off.</p>
			<p>If you have any questions or concerns, please contact us at <a href="tel:8055468699">(805) 546-8699</a></p>
		</div>
	)
}

export default NextSteps;