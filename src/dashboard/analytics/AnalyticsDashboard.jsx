import React, {useEffect, useState} from "react";
import {auth, app} from "../../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";
import {
  getFirestore,
  getDocs,
  where,
  query,
  orderBy,
  collection,
} from "firebase/firestore";
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

const AnalyticsDashboard = () => {
  const [loaded, setLoaded] = useState(false);
  // const [questions, setQuestions] = useState([]);
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [user] = useAuthState(auth);
  const db = getFirestore(app);
  const uid = user.uid;
  const [surveys, setSurveys] = useState([]);
  const emojis = {
    angry: "0x1F621",
    sad: "0x1F614",
    neutral: "0x1F611",
    happy: "0x1F60A",
    love: "0x1F60D",
  };
  useEffect(() => {
    const loadSurveys = async () => {
      const q = query(
        collection(db, "surveys"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
      );
      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        querySnapShot.forEach((doc) => {
          let {
            survey,
            surveyName,
            redirectUrl,
            createdAt,
            updatedAt,
            published,
          } = doc.data();
          let date = new Date(createdAt.seconds * 1000);
          let formattedDate = date.toDateString();
          let baseUrl = `https://www.blossomsurveys.io/${doc.id}`;
          let surveyData = {
            id: doc.id,
            survey: survey,
            surveyName: surveyName.length > 0 ? surveyName : `untitled survey`,
            redirectUrl: redirectUrl,
            date: formattedDate,
            updatedAt: updatedAt,
            surveyLink: baseUrl,
            published: published,
          };

          setSurveys((prevState) => {
            let current = [...prevState];
            current.push(surveyData);
            return current;
          });
        });
      }
      setLoaded(true);
    };
    if (!loaded) {
      loadSurveys();
    }
  }, [db, loaded, uid]);
  const handleSurveyName = (idx) => {
    if (idx >= 0 && idx < surveys.length) {
      setSurveyIndex(idx);
      setQuestionIndex(0);
    }
  };
  const handleQuestionTitle = (idx) => {
    console.log("questionTitle", idx);
    if (idx >= 0 && idx < surveys[surveyIndex].survey.length) {
      setQuestionIndex(idx);
    }
  };
  if (loaded && surveys.length === 0) {
    return <Welcome />;
  }
  return (
    <>
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
