import React, {useEffect, useState, useCallback, useRef} from "react";
import Welcome from "../Welcome";
import {
  AnalyticsContainer,
  SurveyTitle,
  QuestionContainer,
  AnswerChoiceContainer,
  SurveyRow,
  ContainerHeader,
  SurveyContainer,
} from "./analyticsStyles";
// import PieChart from "./PieChart";
import DropdownMenu from "./DropdownMenu";
import {UserData} from "./Data";
import axios from "axios";

const AnalyticsDashboard = () => {
  const [loaded, setLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [survey, setSurvey] = useState([]);
  const [hasSurvey, setHasSurvey] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(0);
  const surveyIdRef = useRef(selectedSurveyId);
  /**
   * colors: [#fa5f55, ]
   */
  // eslint-disable-next-line
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
        backgroundColor: [
          "#525f7f",
          "#fa5f55",
          "#355e3b",
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
  const multiple_choice = ["multi_select", "single_select"];
  // const emojis = {
  //   angry: "0x1F621",
  //   sad: "0x1F614",
  //   neutral: "0x1F611",
  //   happy: "0x1F60A",
  //   love: "0x1F60D",
  // };
  /* <PieChart chartData={userData} /> */
  const loadAnswers = async (questions) => {
    let question_copy = [];
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];

      let {id} = question;
      let question_array = questions.filter((question) => question.id === id);

      try {
        const response = await axios.get(
          `http://localhost:5000/answer_choices/${id}`
        );
        const data = await response.data;
        question_array[0].answerChoices = data;
        question_copy.push(question_array);
      } catch (err) {
        console.error(err.message);
      }
    }

    setQuestions(question_copy.flat());
  };

  const loadQuestions = useCallback(async (survey_id) => {
    try {
      const response = await axios.get(`${endpoint}/questions/${survey_id}`);
      const data = await response.data;

      if (data && data.length) {
        setQuestions(data);
        loadAnswers(data);
      }
    } catch (err) {
      console.error(err.message);
    }
  }, []);
  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const response = await axios.get("http://localhost:5000/surveys/1"); //TODO: change usersid to variable
        const data = await response.data;

        setSurveys(data);
        setSelectedSurveyId(data[0].id);
        loadQuestions(data[0].id);
      } catch (err) {
        console.error(err.message);
      }

      setLoaded(true);
    };
    const countSurveys = async () => {
      const response = await axios.get(`${endpoint}/survey_count/${user_id}`);
      let count = parseInt(response.data);

      if (count > 0) {
        setHasSurvey(true);
      }
    };
    if (!loaded) {
      countSurveys();
      loadSurveys();
    }

    if (surveyIdRef.current !== selectedSurveyId) {
      setSurvey(surveys.filter((survey) => survey.id === selectedSurveyId)[0]);
      loadQuestions(selectedSurveyId);
    }
    surveyIdRef.current = selectedSurveyId;
  }, [loaded, selectedSurveyId, loadQuestions, surveys]);

  if (loaded && !hasSurvey) {
    return <Welcome />;
  }
  return (
    <>
      {loaded && (
        <AnalyticsContainer>
          <SurveyTitle>{survey.title}</SurveyTitle>

          <SurveyRow>
            <SurveyContainer>
              <DropdownMenu
                surveys={surveys}
                setSelectedSurveyId={setSelectedSurveyId}
              />
            </SurveyContainer>
            <QuestionContainer>
              <ContainerHeader> questions </ContainerHeader>
              <div>
                {questions.map((question) => {
                  return (
                    <div key={question.id}>
                      <div>
                        {question.title} - {question.type}
                      </div>
                    </div>
                  );
                })}
              </div>
            </QuestionContainer>
            <AnswerChoiceContainer>
              <ContainerHeader> answer choices </ContainerHeader>

              <ul>
                {questions &&
                  questions.length &&
                  questions[questionIndex].answerChoices &&
                  questions[questionIndex].answerChoices.map((answer) => {
                    return <li key={answer.id}>{answer.choice}</li>;
                  })}
              </ul>
            </AnswerChoiceContainer>
          </SurveyRow>
        </AnalyticsContainer>
      )}
    </>
  );
};
export default AnalyticsDashboard;
