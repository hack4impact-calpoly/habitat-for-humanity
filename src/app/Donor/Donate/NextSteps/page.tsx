"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DonatorNavbar from "components/donor/DonorNavbar/DonorNavbar";
import ProgressBar from "components/donor/donation/ProgressBar";

require("../../../../App.css");

function DonatorNextStepsPage(): React.ReactNode {
  const router = useRouter();

  const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const donePath: string = "/Donor";

    if (e.currentTarget.value === "doneButton") {
      router.push(donePath);
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
          review your donation in two to three business days. Please expect an
          email from us with updates regarding your donation pick up or drop
          off.
        </p>
        <p className="mb-4 italic text-sm text-gray-600">
          Please check your junk or spam folder if you don't see a confirmation
          email.
        </p>
        <p id="donNextStepsQuestions">
          If you have any questions or concerns, please contact us at{" "}
        </p>
        <a
          href="mailto:restoreslo@habitatslo.org"
          className="text-blue-600 underline ml-1"
        >
          restoreslo@habitatslo.org
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
