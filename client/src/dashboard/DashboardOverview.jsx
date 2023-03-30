import React, {useEffect, useState} from "react";
// import {auth} from "../firebase-config";
// import {useAuthState} from "react-firebase-hooks/auth";
import axios from "axios";
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

const DashboardOverview = () => {
  // const [user] = useAuthState(auth);

  // const uid = user.uid; TODO: switch to postfres
  const user_id = 1;
  const [hasSurvey, setHasSurvey] = useState(false);
  const [surveyCount, setSurveyCount] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [numberOfResponses, setNumberOfResponses] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [questionTypeCounts, setQuestionTypeCounts] = useState([]);

  useEffect(() => {
    const countSurveys = async () => {
      const response = await axios.get(`${endpoint}/survey_count/${user_id}`);
      let count = parseInt(response.data);

      if (count > 0) {
        setHasSurvey(true);
      }
      setSurveyCount(count);
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
    setLoaded(true);
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
