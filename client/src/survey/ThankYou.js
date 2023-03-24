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

const ThankYou = ({redirectUrl, surveyHash}) => {
  if (
    redirectUrl.length > 0 &&
    !redirectUrl.startsWith("http://") &&
    !redirectUrl.startsWith("https://")
  ) {
    redirectUrl.replace("/^/", "http://");
    redirectUrl = "http://" + redirectUrl;
  }
  useEffect(() => {
    //TODO: remove id from local storage bsmr
    localStorage.removeItem("bsmr");
    if (localStorage.getItem("sids") === null) {
      localStorage.setItem("sids", JSON.stringify([surveyHash]));
    } else {
      let sids = JSON.parse(localStorage.getItem("sids"));
      if (!sids.includes(surveyHash)) {
        sids.push(surveyHash);
        localStorage.setItem("sids", JSON.stringify(sids));
      }
    }
    if (redirectUrl.length > 0) {
      setTimeout(() => {
        if (redirectUrl) {
          window.location.replace(redirectUrl);
        }
      }, 3000);
    }
  }, [redirectUrl, surveyHash]);
  return (
    <Container>
      <Thanks>thank you</Thanks>
      <FlowerImage src={flower3} />
      <Completed>survey completed</Completed>
      {localStorage.getItem("sid") !== surveyHash && redirectUrl.length > 0 ? (
        <RedirectUrl>redirecting you to {redirectUrl} ...</RedirectUrl>
      ) : null}
    </Container>
  );
};
export default ThankYou;
