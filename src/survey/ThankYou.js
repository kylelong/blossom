import React from "react";
import styled from "styled-components";
import flower3 from "../images/scandi-334.svg";
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 20px;
`;
export const Thanks = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #355e3b;
  margin-bottom: 18px;
`;
export const Completed = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #355e3b;
`;
export const FlowerImage = styled.img`
  height: 60px;
  width: 60px;
  margin-bottom: 18px;
`;
const ThankYou = ({redirectUrl}) => {
  return (
    <Container>
      <Thanks>thank you</Thanks>
      <FlowerImage src={flower3} />
      <Completed>survey completed</Completed>
      {redirectUrl.length > 0 ? (
        <div>redirecting you to {redirectUrl}</div>
      ) : null}
    </Container>
  );
};
export default ThankYou;
