import React from "react";
import styled from 'styled-components';

const ProgressBarLine = styled.div`
   width: 100%;
   border-bottom: 1px solid grey;
   margin: auto;
   margin-bottom: 3em;
`;

const ProgressBarContainer = styled.div`
`;

const ProgressBar = (): JSX.Element => {
   return (
      <>
         <ProgressBarContainer>
            <ProgressBarLine>
         
            </ProgressBarLine>
         </ProgressBarContainer>
      </>
   );
};

export default ProgressBar;