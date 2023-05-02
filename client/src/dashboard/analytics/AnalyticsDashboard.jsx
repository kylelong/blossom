import React, {useEffect, useState, useCallback, useRef, useMemo} from "react";
import Welcome from "../Welcome";
import {
  AnalyticsContainer,
  SurveyTitle,
  QuestionContainer,
  AnswerChoiceContainer,
  SurveyRow,
  ContainerHeader,
  SurveyContainer,
  Question,
  SelectedQuestion,
  QuestionType,
  EmojiRow,
  Emoji,
  EmojiContainer,
  AnswerWrapper,
  SurveyButton,
} from "./analyticsStyles";
// import PieChart from "./PieChart";
import DropdownMenu from "./DropdownMenu";
import ProgressBar from "./ProgressBar";
import EmojiStat from "./EmojiStat";
import AnswerChoice from "./AnswerChoice";
import ScrollArea from "./ScrollArea";
import {UserData} from "./Data";
import axios from "axios";
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

const AnalyticsDashboard = () => {
  const [loaded, setLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [survey, setSurvey] = useState([]);
  const [hasSurvey, setHasSurvey] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [emojiAnalytics, setEmojiAnalytics] = useState([]);
  const [openEndedAnalytics, setOpenEndedAnalytics] = useState([]);
  const [answerChoiceAnalytics, setAnswerChoiceAnalytics] = useState([]);
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

  const multiple_choice = useMemo(() => ["multi_select", "single_select"], []);
  const emojis = {
    angry: "0x1F621",
    sad: "0x1F614",
    neutral: "0x1F611",
    happy: "0x1F60A",
    love: "0x1F60D",
  };
  const validQuestions =
    questions && questions.length > 0 && questions[questionIndex];
  /* <PieChart chartData={userData} /> */
  const handleQuestionChange = useCallback(
    (index, type, id) => {
      setQuestionIndex(index);
      if (multiple_choice.includes(type)) {
        loadAnswerChoiceAnalytics(id);
      } else if (type === "emoji_sentiment") {
        loadEmojiAnalytics(id);
      } else if (type === "open_ended") {
        loadOpenEnededAnalytics(id);
      }
    },
    [multiple_choice]
  );
  const loadEmojiAnalytics = async (question_id) => {
    try {
      const response = await axios.get(
        `${endpoint}/emoji_analytics/${question_id}`
      );
      const data = await response.data;
      setEmojiAnalytics(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  const loadAnswerChoiceAnalytics = async (question_id) => {
    try {
      const response = await axios.get(
        `${endpoint}/answer_choice_analytics/${question_id}`
      );
      const data = await response.data;
      setAnswerChoiceAnalytics(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  const loadOpenEnededAnalytics = async (question_id) => {
    try {
      const response = await axios.get(
        `${endpoint}/open_ended_analytics/${question_id}`
      );
      const data = await response.data;
      setOpenEndedAnalytics(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  const loadAnswers = async (questions) => {
    let question_copy = [];
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];

      let {id} = question;
      let question_array = questions.filter((question) => question.id === id);

      try {
        const response = await axios.get(`${endpoint}/answer_choices/${id}`);
        const data = await response.data;
        question_array[0].answerChoices = data;
        question_copy.push(question_array);
      } catch (err) {
        console.error(err.message);
      }
    }

    setQuestions(question_copy.flat());
  };

  const loadQuestions = useCallback(
    async (survey_id) => {
      try {
        const response = await axios.get(`${endpoint}/questions/${survey_id}`);
        const data = await response.data;

        if (data && data.length) {
          setQuestions(data);
          const {type, id} = data[0];
          handleQuestionChange(0, type, id);
          loadAnswers(data);
        }
      } catch (err) {
        console.error(err.message);
      }
    },
    [handleQuestionChange]
  );
  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const response = await axios.get(`${endpoint}/published_surveys`);
        const data = await response.data;

        setSurveys(data);
        if (data && data.length) {
          setSelectedSurveyId(data[0].id);
          loadQuestions(data[0].id);
        }
      } catch (err) {
        console.error(err.message);
      }

      setLoaded(true);
    };
    const countSurveys = async () => {
      const response = await axios.get(`${endpoint}/survey_count`);
      let count = parseInt(response.data);

      if (count > 0) {
        setHasSurvey(true);
      }
    };
    const publishedSurveyCount = async () => {
      const response = await axios.get(`${endpoint}/published_survey_count`);
      let count = parseInt(response.data);

      setPublishedCount(count);
    };
    const countDrafts = async () => {
      const response = await axios.get(`${endpoint}/draft_survey_count`);
      const data = await response.data;
      const count = data;
      if (count > 0) {
        setHasDraft(true);
      }
    };
    if (!loaded) {
      countSurveys();
      countDrafts();
      loadSurveys();
      publishedSurveyCount();
    }

    if (surveyIdRef.current !== selectedSurveyId) {
      setSurvey(surveys.filter((survey) => survey.id === selectedSurveyId)[0]);
      loadQuestions(selectedSurveyId);
    }
    surveyIdRef.current = selectedSurveyId;
  }, [loaded, selectedSurveyId, loadQuestions, surveys]);

  const buttonText = hasDraft
    ? `finish your draft survey ${String.fromCodePoint("0x1F91D")}`
    : `create a new survey ${String.fromCodePoint("0x1F680")}`;

  if (loaded && !hasSurvey) {
    return <Welcome />;
  }
  if (loaded && publishedCount === 0 && hasDraft) {
    return (
      <>
        <a href="/create">
          <AnalyticsContainer>
            <SurveyButton>{buttonText}</SurveyButton>
          </AnalyticsContainer>
        </a>
      </>
    );
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
                {questions.map((question, index) => {
                  return (
                    <div key={question.id}>
                      {index === questionIndex ? (
                        <SelectedQuestion
                          onClick={() =>
                            handleQuestionChange(
                              index,
                              question.type,
                              question.id
                            )
                          }
                        >
                          {question.title}
                          <QuestionType>{question.type}</QuestionType>
                        </SelectedQuestion>
                      ) : (
                        <Question
                          onClick={() =>
                            handleQuestionChange(
                              index,
                              question.type,
                              question.id
                            )
                          }
                        >
                          {question.title}
                          <QuestionType>{question.type}</QuestionType>
                        </Question>
                      )}
                    </div>
                  );
                })}
              </div>
            </QuestionContainer>
            <AnswerChoiceContainer>
              <ContainerHeader> answer choices </ContainerHeader>
              {validQuestions &&
                questions[questionIndex].type === "emoji_sentiment" && (
                  <EmojiRow>
                    {Object.entries(emojis)
                      .reverse()
                      .map(([key, value]) => {
                        let index = emojiAnalytics.findIndex(
                          (em) => em.answer === value
                        );
                        let progress =
                          index > -1 ? emojiAnalytics[index].avg * 100 : 0;
                        return (
                          <EmojiContainer key={key}>
                            <Emoji>{String.fromCodePoint(value)}</Emoji>
                            <ProgressBar number={progress} />
                            <EmojiStat
                              emoji={value}
                              emojiAnalytics={emojiAnalytics}
                            />
                          </EmojiContainer>
                        );
                      })}
                  </EmojiRow>
                )}

              <AnswerWrapper>
                {validQuestions &&
                  multiple_choice.includes(questions[questionIndex].type) &&
                  questions[questionIndex].answerChoices &&
                  questions[questionIndex].answerChoices.map((answer) => {
                    return (
                      <AnswerChoice
                        key={answer.id}
                        choice={answer.choice}
                        answerChoiceAnalytics={answerChoiceAnalytics}
                      />
                    );
                  })}
                {validQuestions &&
                  questions[questionIndex].type === "open_ended" && (
                    <ScrollArea data={openEndedAnalytics} />
                  )}
              </AnswerWrapper>
            </AnswerChoiceContainer>
          </SurveyRow>
        </AnalyticsContainer>
      )}
    </>
  );
};
export default AnalyticsDashboard;
