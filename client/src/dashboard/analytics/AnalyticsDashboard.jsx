import React, {useEffect, useState} from "react";
import Welcome from "../Welcome";
// import {
//   AnalyticsContainer,
//   AnalyticsSection,
//   AnalyticsHeader,
//   AnalyticsSurveyName,
//   AnalyticsSurveyNameSelected,
//   QuestionTitle,
//   QuestionTitleSelected,
//   AnswerChoice,
//   QuestionType,
//   QuestionItem,
//   EmojiRow,
//   Emoji,
// } from "./analyticsStyles";
import PieChart from "./PieChart";
import {UserData} from "./Data";
import axios from "axios";

const AnalyticsDashboard = () => {
  const [loaded, setLoaded] = useState(false);
  // const [questions, setQuestions] = useState([]);
  //const [surveyIndex, setSurveyIndex] = useState(0);
  // const [questionIndex, setQuestionIndex] = useState(0);
  //const [surveys, setSurveys] = useState([]);
  const [hasSurvey, setHasSurvey] = useState(false);
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

  // const emojis = {
  //   angry: "0x1F621",
  //   sad: "0x1F614",
  //   neutral: "0x1F611",
  //   happy: "0x1F60A",
  //   love: "0x1F60D",
  // };
  useEffect(() => {
    // setSurveys([]);
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
    </>
  );
};
export default AnalyticsDashboard;
