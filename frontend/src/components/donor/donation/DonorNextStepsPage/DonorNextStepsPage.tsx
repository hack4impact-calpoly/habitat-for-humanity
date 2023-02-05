import React from "react";
import { useNavigate } from "react-router-dom";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import ProgressBar from "components/donor/donation/ProgressBar";

require("./DonorNextStepsPage.css");

function DonatorNextStepsPage(): JSX.Element {
  const navigate = useNavigate();

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const donePath: string = "/Donor";

    if (e.currentTarget.value === "doneButton") {
      navigate(donePath);
    }
  };

  return (
    <div>
      <DonatorNavbar />
      <div id="donNextStepsPage">
        <ProgressBar activeStep={5} />
        <h2 id="donNextStepsHeader">Confirmation and Next Steps</h2>
        <p id="donNextStepsDesc">
          You have successfully submitted your donation form! Our staff will
          review your donation in the next few days. Please expect an email from
          us with updates regarding your donation pick up or drop off.
        </p>
        <p id="donNextStepsQuestions">
          If you have any questions or concerns, please contact us at{" "}
        </p>
        <a style={{ textDecoration: "none" }} href="tel: +8055468699">
          <p id="donNextStepsPhone">(805) 546-8699</p>
        </a>
        <button
          type="submit"
          value="doneButton"
          className="doneButton"
          onClick={buttonNavigation}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default DonatorNextStepsPage;
