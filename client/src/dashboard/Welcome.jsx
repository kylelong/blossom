// for users with no surveys
import React from "react";

import styled from "styled-components";
import "./welcome.css";
import flower from "../images/scandi-330.svg";

export const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 55vh;
`;
export const WelcomeMsg = styled.div`
  font-size: 20px;
  margin-bottom: 22px;
`;

export const Flower = styled.img`
  height: 100;
  margin-bottom: 22px;
`;

const Welcome = () => {
  return (
    <WelcomeContainer>
      <WelcomeMsg>welcome to blossom &#x1F60A;</WelcomeMsg>
      <Flower src={flower} alt="flower" />
      <a href="/create">
        <button className="createBtn">
          create your first survey &#128640;
        </button>
      </a>
    </WelcomeContainer>
  );
};

export default Welcome;
