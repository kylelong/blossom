import React, {useEffect, useState, useContext} from "react";
import axios from "axios";

// import jwt_decode from "jwt-decode";

import Welcome from "./Welcome";
import {AccountContext} from "../context/AccountContext";
import {
  DashboardStatHeader,
  DashboardOverviewHeader,
  DashboardOverviewContainer,
  DashboardStat,
  DashboardNumber,
  DashboardStatContainer,
  SurveyButton,
  QuestionTypeBreakdown,
  QuestionTypeItem,
  QuestionTypeLabel,
  QuestionTypeNumber,
} from "./dashboardStyles";
import VerifyEmailNotice from "./VerifyEmailNotice";
import SubscribeNotice from "./SubscribeNotice";
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

// axios.defaults.withCredentials = true;
// axios.defaults.headers.common["Content-Type"] = "application/json";
const options = {
  withCredentials: true,
  crossDomain: true,
};

const DashboardOverview = () => {
  const [hasSurvey, setHasSurvey] = useState(false);
  const [surveyCount, setSurveyCount] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [numberOfResponses, setNumberOfResponses] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [questionTypeCounts, setQuestionTypeCounts] = useState([]);
  const {user} = useContext(AccountContext);

  useEffect(() => {
    const countSurveys = async () => {
      const response = await axios.get(`${endpoint}/survey_count/`, options);
      const data = await response.data;
      let count = parseInt(data);

      if (count > 0) {
        setHasSurvey(true);
      }
      setSurveyCount(count);
      setLoaded(true);
    };

    const countDrafts = async () => {
      const response = await axios.get(
        `${endpoint}/draft_survey_count/`,
        options
      );
      const data = await response.data;
      const count = data;
      if (count > 0) {
        setHasDraft(true);
      }
      setLoaded(true);
    };

    const countQuestions = async () => {
      const response = await axios.get(`${endpoint}/question_count/`, options);
      const count = response.data;
      setNumberOfQuestions(count);
      setLoaded(true);
    };

    const countQuestionTypes = async () => {
      const response = await axios.get(
        `${endpoint}/question_type_count/`,
        options
      );
      const data = response.data;
      setQuestionTypeCounts(data);
      setLoaded(true);
    };
    const countResponses = async () => {
      const response = await axios.get(
        `${endpoint}/number_of_responses/`,
        options
      );
      const count = response.data;
      setNumberOfResponses(count);
      setLoaded(true);
    };

    countSurveys();
    countDrafts();
    countQuestions();
    countQuestionTypes();
    countResponses();
  }, [loaded, surveyCount, numberOfQuestions]);

  const buttonText = hasDraft
    ? `finish your draft survey ${String.fromCodePoint("0x1F91D")}`
    : `create a new survey ${String.fromCodePoint("0x1F680")}`;

  if (user && !user.confirmed) {
    return <VerifyEmailNotice />;
  }

  if (user && !user.access && !user.premium) {
    return <SubscribeNotice />;
  }

  if (loaded && !hasSurvey) {
    return <Welcome />;
  }

  return (
    <div>
      {surveyCount > 0 && (
        <DashboardOverviewContainer>
          <DashboardOverviewHeader>surveys overview</DashboardOverviewHeader>
          <DashboardStatContainer>
            {hasSurvey && (
              <DashboardStat>
                <DashboardNumber>{surveyCount}</DashboardNumber>
                <DashboardStatHeader>
                  surveys {String.fromCodePoint("0x1F4DD")}`
                </DashboardStatHeader>
              </DashboardStat>
            )}

            {numberOfQuestions > 0 && (
              <DashboardStat>
                <DashboardNumber>{numberOfQuestions}</DashboardNumber>
                <DashboardStatHeader>
                  questions {String.fromCodePoint("0x2753")}`
                </DashboardStatHeader>
              </DashboardStat>
            )}
            <DashboardStat>
              <DashboardNumber>{numberOfResponses}</DashboardNumber>
              <DashboardStatHeader>
                responses {String.fromCodePoint("0x1F5E3")}
              </DashboardStatHeader>
            </DashboardStat>
          </DashboardStatContainer>
          <QuestionTypeBreakdown>
            <DashboardOverviewHeader>question types </DashboardOverviewHeader>
            {questionTypeCounts.map((key, index) => {
              return (
                <div key={index}>
                  <QuestionTypeItem>
                    <QuestionTypeLabel>
                      {key.type === "" ? "draft_questions" : key.type}
                    </QuestionTypeLabel>
                    <QuestionTypeNumber>{key.count}</QuestionTypeNumber>
                  </QuestionTypeItem>
                </div>
              );
            })}
          </QuestionTypeBreakdown>

          <a href="/create">
            <SurveyButton>{buttonText}</SurveyButton>
          </a>
        </DashboardOverviewContainer>
      )}
    </div>
  );
};
export default DashboardOverview;
