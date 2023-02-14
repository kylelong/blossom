import React, {useEffect} from "react";
import styled from "styled-components";
import flower3 from "../images/scandi-334.svg";
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
export const RedirectUrl = styled.div`
  margin-top: 24px;
`;

const ThankYou = ({redirectUrl, surveyId}) => {
  useEffect(() => {
    if (localStorage.getItem("sid") !== surveyId) {
      setTimeout(() => {
        localStorage.setItem("sid", surveyId);
        window.location.href = redirectUrl;
      }, 3000);
    }
  }, [redirectUrl, surveyId]);
  return (
    <Container>
      <Thanks>thank you</Thanks>
      <FlowerImage src={flower3} />
      <Completed>survey completed</Completed>
      {localStorage.getItem("sid") !== surveyId && redirectUrl.length > 0 ? (
        <RedirectUrl>redirecting you to {redirectUrl} ...</RedirectUrl>
      ) : null}
    </Container>
  );
};
export default ThankYou;
