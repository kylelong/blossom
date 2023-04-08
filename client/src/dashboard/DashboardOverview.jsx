import React, {useEffect, useState} from "react";
import axios from "axios";
// import jwt_decode from "jwt-decode";

import Welcome from "./Welcome";
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
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;
const user_id = 1;
const DashboardOverview = () => {
  // const [userId, setUserId] = useState(() => {
  //   let token = localStorage.getItem("token");
  //   if (token) {
  //     let decoded = jwt_decode(token);
  //     return decoded.id;
  //   }
  //   return 0;
  // });

  const [hasSurvey, setHasSurvey] = useState(false);
  const [surveyCount, setSurveyCount] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [numberOfResponses, setNumberOfResponses] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [questionTypeCounts, setQuestionTypeCounts] = useState([]);

  useEffect(() => {
    // let token = localStorage.getItem("token");
    // if (userId === 0 && token) {
    //   let decoded = jwt_decode(token);
    //   setUserId(decoded.id);
    // }

    const countSurveys = async () => {
      const response = await axios.get(`${endpoint}/survey_count/${user_id}`);
      let count = parseInt(response.data);

      if (count > 0) {
        setHasSurvey(true);
      }
      setSurveyCount(count);
      setLoaded(true);
    };

    const countDrafts = async () => {
      const response = await axios.get(
        `${endpoint}/draft_survey_count/${user_id}`
      );
      const count = response.data;
      if (count > 0) {
        setHasDraft(true);
      }
    };

    const countQuestions = async () => {
      const response = await axios.get(`${endpoint}/question_count/${user_id}`);
      const count = response.data;
      setNumberOfQuestions(count);
    };

    const countQuestionTypes = async () => {
      const response = await axios.get(
        `${endpoint}/question_type_count/${user_id}`
      );
      const data = response.data;
      setQuestionTypeCounts(data);
    };
    const countResponses = async () => {
      const response = await axios.get(
        `${endpoint}/number_of_responses/${user_id}`
      );
      const count = response.data;
      setNumberOfResponses(count);
    };

    countSurveys();
    countDrafts();
    countQuestions();
    countQuestionTypes();
    countResponses();
  }, [loaded]);

  const buttonText = hasDraft
    ? `finish your draft survey ${String.fromCodePoint("0x1F91D")}`
    : `create a new survey ${String.fromCodePoint("0x1F680")}`;

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
