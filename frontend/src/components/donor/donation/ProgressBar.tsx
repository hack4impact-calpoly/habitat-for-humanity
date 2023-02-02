import React, { useState } from "react";
import styled from 'styled-components';
import { BsCheckLg } from "react-icons/bs";

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
   margin-left: 6px;
`;

const ProgressBar = ({ activeStep }: ProgressBarProps): JSX.Element => {
   const changeColor = (currentStep: number) => {
      return (currentStep <= activeStep ? 'var(--primary)' : 'var(--gray-dark)')
   }
   const changeTextColor = (currentStep: number) => {
      return (currentStep == activeStep ? 'var(--primary)' : 'var(--gray-dark)')
   }

   return (
      <>
         <PBContainer>
            <ProgressStep style={{ backgroundColor: changeColor(1)}}>
               <PText style={{ color: changeTextColor(1)}}>Item Info</PText>
               {(1 < activeStep ? <PIcon size={12}/>: null)}
            </ProgressStep>
            <ProgressStep style={{backgroundColor: changeColor(2)}}>
               <PText style={{ color: changeTextColor(2)}}>Location</PText>
               {(2 < activeStep ? <PIcon size={12}/>: null)}
            </ProgressStep>
            <ProgressStep style={{backgroundColor: changeColor(3)}}>
               <PText style={{ color: changeTextColor(3)}}>Schedule</PText>
               {(3 < activeStep ? <PIcon size={12}/>: null)}
            </ProgressStep>
            <ProgressStep style={{backgroundColor: changeColor(4)}}>
               <PText style={{ color: changeTextColor(4)}}>Review</PText>
               {(4 < activeStep ? <PIcon size={12}/>: null)}
            </ProgressStep>
         </PBContainer>
      </>
   );
};

export default ProgressBar;