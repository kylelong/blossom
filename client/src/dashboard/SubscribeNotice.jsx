/**
 * show this once the free trial is over
 */
import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {InfoCircledIcon} from "@radix-ui/react-icons";
import {Link} from "react-router-dom";
import axios from "axios";

const TrialContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 12px;
  margin-right: 10px;
  background-color: #eff5fb;
  color: rgb(250, 95, 85);
  padding: 1.25rem 0.5rem 1.25rem 1.5rem;
  border-radius: 4px;
  margin-top: 32px;
`;
const TrialMessage = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
`;

const linkStyle = {
  textDecoration: "none",
  color: "rgb(250, 95, 85)",
};
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

const SubscribeNotice = () => {
  const [trialData, setTrialData] = useState({
    msg: "",
    access: false,
    premium: true,
  });
  useEffect(() => {
    const getTrialMessage = async () => {
      const response = await axios.get(`${endpoint}/trial_info`);
      setTrialData(response.data);
    };
    getTrialMessage();
  }, []);
  return (
    <>
      {!trialData.access && !trialData.premium && (
        <TrialContainer>
          <Link to="/account" style={linkStyle}>
            <TrialMessage>
              <InfoCircledIcon
                style={{position: "relative", top: "2.45px", right: "2px"}}
              />
              {trialData.msg}
            </TrialMessage>
          </Link>
        </TrialContainer>
      )}
    </>
  );
};

export default SubscribeNotice;
