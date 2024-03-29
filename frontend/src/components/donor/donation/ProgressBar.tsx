import React, { useState } from "react";
import styled from "styled-components";
import { BsCheckLg } from "react-icons/bs";
import { useScreenSize } from "hooks";

type ProgressBarProps = {
  activeStep: number;
};

const PBContainer = styled.div`
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 1px;
    width: 100%;
    background-color: var(--gray-dark);
    z-index: -1;
  }
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 2rem auto 4em auto;
`;

const ProgressStep = styled.div`
  width: 25px;
  height: 25px;
  background-color: var(--gray-dark);
  border-radius: 50%;
  display: flex;
  justify-content: center;
`;

const PText = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  font-size: 1em;
  color: var(--gray-text);
  white-space: nowrap;
  overflow: hidden;
`;

const PIcon = styled(BsCheckLg)`
  size: 2px;
  color: var(--white-gray);
  margin-top: 7px;
`;

function ProgressBar({ activeStep }: ProgressBarProps): JSX.Element {
  const screenSize = useScreenSize();
  const changeColor = (currentStep: number) =>
    currentStep <= activeStep ? "var(--primary)" : "var(--gray-dark)";
  const changeTextColor = (currentStep: number) =>
    currentStep === activeStep ? "var(--primary)" : "var(--gray-dark)";

  return (
    <PBContainer>
      <ProgressStep
        style={{
          backgroundColor: changeColor(1),
          justifyContent: "flex-start",
        }}
      >
        <PText style={{ color: changeTextColor(1) }}>Item Info</PText>
        {activeStep > 1 ? (
          <PIcon size={12} style={{ marginLeft: "6px" }} />
        ) : null}
      </ProgressStep>
      <ProgressStep style={{ backgroundColor: changeColor(2) }}>
        <PText style={{ color: changeTextColor(2) }}>Location</PText>
        {activeStep > 2 ? <PIcon size={12} /> : null}
      </ProgressStep>
      <ProgressStep style={{ backgroundColor: changeColor(3) }}>
        <PText style={{ color: changeTextColor(3) }}>Schedule</PText>
        {activeStep > 3 ? <PIcon size={12} /> : null}
      </ProgressStep>
      <ProgressStep
        style={{ backgroundColor: changeColor(4), justifyContent: "flex-end" }}
      >
        <PText style={{ color: changeTextColor(4) }}>{`Review${
          !["xs"].includes(screenSize as string) ? ` + Submit` : ""
        }`}</PText>
        {activeStep > 4 ? (
          <PIcon size={12} style={{ marginRight: "6px" }} />
        ) : null}
      </ProgressStep>
    </PBContainer>
  );
}

export default ProgressBar;
