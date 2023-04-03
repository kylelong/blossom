import React, {useEffect, useState} from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

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
const endpoint = process.env.REACT_APP_LOCALHOST_URL;
const secret = "B2yLmPn7T4GhYb3s2j6fK8dN1";

const DashboardOverview = () => {
  const [userId, setUserId] = useState(() => {
    let token = localStorage.getItem("token");
    let decoded = jwt_decode(token);
    return decoded.id;
  });

  const [hasSurvey, setHasSurvey] = useState(false);
  const [surveyCount, setSurveyCount] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [numberOfResponses, setNumberOfResponses] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [questionTypeCounts, setQuestionTypeCounts] = useState([]);

  useEffect(() => {
    const countSurveys = async () => {
      const response = await axios.get(`${endpoint}/survey_count`);
      let count = parseInt(response.data);

      if (count > 0) {
        setHasSurvey(true);
      }
      setSurveyCount(count);
      setLoaded(true);
    };

    const countDrafts = async () => {
      const response = await axios.get(
        `${endpoint}/draft_survey_count/${userId}`
      );
      const count = response.data;
      if (count > 0) {
        setHasDraft(true);
      }
    };

    const countQuestions = async () => {
      const response = await axios.get(`${endpoint}/question_count/${userId}`);
      const count = response.data;
      setNumberOfQuestions(count);
    };

    const countQuestionTypes = async () => {
      const response = await axios.get(
        `${endpoint}/question_type_count/${userId}`
      );
      const data = response.data;
      setQuestionTypeCounts(data);
    };
    const countResponses = async () => {
      const response = await axios.get(
        `${endpoint}/number_of_responses/${userId}`
      );
      const count = response.data;
      setNumberOfResponses(count);
    };

    countSurveys();
    countDrafts();
    countQuestions();
    countQuestionTypes();
    countResponses();
  }, [loaded, userId]);

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
                <DashboardStatHeader>surveys</DashboardStatHeader>
              </DashboardStat>
            )}

            {numberOfQuestions > 0 && (
              <DashboardStat>
                <DashboardNumber>{numberOfQuestions}</DashboardNumber>
                <DashboardStatHeader>questions </DashboardStatHeader>
              </DashboardStat>
            )}
            <DashboardStat>
              <DashboardNumber>{numberOfResponses}</DashboardNumber>
              <DashboardStatHeader>responses</DashboardStatHeader>
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
