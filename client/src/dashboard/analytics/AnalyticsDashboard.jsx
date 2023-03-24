import React, {useEffect, useState} from "react";
import Welcome from "../Welcome";
import {
  AnalyticsContainer,
  AnalyticsSection,
  AnalyticsHeader,
  AnalyticsSurveyName,
  AnalyticsSurveyNameSelected,
  QuestionTitle,
  QuestionTitleSelected,
  AnswerChoice,
  QuestionType,
  QuestionItem,
  EmojiRow,
  Emoji,
} from "./analyticsStyles";
import PieChart from "./PieChart";
import {UserData} from "./Data";
import axios from "axios";

const AnalyticsDashboard = () => {
  const [loaded, setLoaded] = useState(false);
  // const [questions, setQuestions] = useState([]);
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [hasSurvey, setHasSurvey] = useState(false);
  // eslint-disable-next-line
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const endpoint = "http://localhost:5000";
  const user_id = 1;

  const emojis = {
    angry: "0x1F621",
    sad: "0x1F614",
    neutral: "0x1F611",
    happy: "0x1F60A",
    love: "0x1F60D",
  };
  useEffect(() => {
    setSurveys([]);
    const countSurveys = async () => {
      const response = await axios.get(`${endpoint}/survey_count/${user_id}`);
      let count = parseInt(response.data);

      if (count > 0) {
        setHasSurvey(true);
      }
    };
    setLoaded(true);
    const loadSurveys = async () => {};
    if (!loaded) {
      loadSurveys();
    }
    countSurveys();
  }, [loaded]);
  const handleSurveyName = (idx) => {
    if (idx >= 0 && idx < surveys.length) {
      setSurveyIndex(idx);
      setQuestionIndex(0);
    }
  };
  const handleQuestionTitle = (idx) => {
    if (idx >= 0 && idx < surveys[surveyIndex].survey.length) {
      setQuestionIndex(idx);
    }
  };
  if (loaded && !hasSurvey) {
    return <Welcome />;
  }
  return (
    <>
      {loaded && (
        <div>
          <PieChart chartData={userData} />
        </div>
      )}
      {loaded && (
        <AnalyticsContainer>
          <AnalyticsSection>
            <AnalyticsHeader>Surveys</AnalyticsHeader>
            {surveys.map((survey, idx) => {
              return (
                <div key={idx}>
                  {idx === surveyIndex ? (
                    <AnalyticsSurveyNameSelected
                      onClick={() => handleSurveyName(idx)}
                    >
                      {survey.surveyName}
                    </AnalyticsSurveyNameSelected>
                  ) : (
                    <AnalyticsSurveyName onClick={() => handleSurveyName(idx)}>
                      {survey.surveyName}
                    </AnalyticsSurveyName>
                  )}
                </div>
              );
            })}
          </AnalyticsSection>
          <AnalyticsSection>
            <AnalyticsHeader>Questions</AnalyticsHeader>
            <div>
              {!surveys[surveyIndex].published && (
                <a href="/create">
                  <button
                    className="createBtn"
                    style={{display: "flex", marginTop: "10px"}}
                  >
                    publish this survey {String.fromCodePoint("0x1F91D")}
                  </button>
                </a>
              )}
              {surveys[surveyIndex].survey.map((question, idx) => {
                return (
                  <div key={idx}>
                    {idx === questionIndex ? (
                      <QuestionItem>
                        <QuestionTitleSelected
                          onClick={() => handleQuestionTitle(idx)}
                        >
                          {question.questionTitle}
                        </QuestionTitleSelected>
                        <QuestionType>
                          {
                            surveys[surveyIndex].survey[questionIndex]
                              .questionType
                          }
                        </QuestionType>
                      </QuestionItem>
                    ) : (
                      <QuestionItem>
                        <QuestionTitle onClick={() => handleQuestionTitle(idx)}>
                          {question.questionTitle}
                        </QuestionTitle>
                      </QuestionItem>
                    )}
                  </div>
                );
              })}
            </div>
          </AnalyticsSection>
          <AnalyticsSection>
            <AnalyticsHeader>Answer Choices</AnalyticsHeader>
            <div>
              {surveys[surveyIndex].survey[questionIndex].questionType ===
              "emoji_sentiment" ? (
                <EmojiRow>
                  {Object.entries(emojis).map(([key, value]) => {
                    return (
                      <Emoji key={key}>{String.fromCodePoint(value)}</Emoji>
                    );
                  })}
                </EmojiRow>
              ) : (
                surveys[surveyIndex].survey[questionIndex].answerChoices &&
                surveys[surveyIndex].survey[questionIndex].answerChoices.map(
                  (choice, idx) => {
                    return <AnswerChoice key={idx}>{choice}</AnswerChoice>;
                  }
                )
              )}
            </div>
          </AnalyticsSection>
        </AnalyticsContainer>
      )}
    </>
  );
};
export default AnalyticsDashboard;
