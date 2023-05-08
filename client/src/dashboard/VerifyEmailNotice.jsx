import React from "react";
import styled from "styled-components";
import {InfoCircledIcon} from "@radix-ui/react-icons";

const TrialContainer = styled.a`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 12px;
  margin-right: 10px;
  background-color: #eff5fb;
  color: rgb(250, 95, 85);
  // color: #0a2540;
  padding: 1.25rem 0.5rem 1.25rem 1.5rem;
  border-radius: 4px;
  max-width: 400px;
  width: 100%;
  margin-top: 32px;
`;
const TrialMessage = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 23px;
`;

const VerifyEmailNotice = () => {
  return (
    <TrialContainer>
      <TrialMessage>
        <InfoCircledIcon
          style={{
            position: "relative",
            top: "2px",
            right: "2px",
            marginRight: "2px",
          }}
        />
        Please check your inbox to confirm your email. Refresh the page
        afterwards to continue using Blossom. Check your spam folder just in
        case.
      </TrialMessage>
    </TrialContainer>
  );
};

export default VerifyEmailNotice;
