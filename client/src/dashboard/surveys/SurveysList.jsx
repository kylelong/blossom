import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";
import axios from "axios";
import styled from "styled-components";

import SurveyPreview from "../surveyPreview/SurveyPreview";
import {AccountContext} from "../../context/AccountContext";
import VerifyEmailNotice from "../VerifyEmailNotice";
import SubscribeNotice from "../SubscribeNotice";
import Welcome from "../Welcome";
import * as RadioGroup from "@radix-ui/react-radio-group";
import {ClipboardCopyIcon, CheckCircledIcon} from "@radix-ui/react-icons";
import {CopyToClipboard} from "react-copy-to-clipboard";
import "./surveys.css";

export const FinishButton = styled.button`
  all: unset;
  display: flex;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  font-size: 17px;
  padding: 0 18px;
  line-height: 38px;
  height: 46px;
  width: auto;
  margin-left: 12px;
  color: white;
  background-color: #355e3b;
  box-shadow: 0 2px 10px var(--blackA7);

  &:hover {
    background-color: rgb(0, 100, 0);
    cursor: pointer;
  }
  @media (min-width: 1260px) {
    margin-left: 155px;
  }
`;
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

const siteUrl =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_URL
    : process.env.REACT_APP_LOCAL_URL;

const SurveysList = () => {
  const [surveys, setSurveys] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentSurveyIndex, setCurrentSurveyIndex] = useState(0);
  const [questionId, setQuestionId] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const [link, setLink] = useState("");
  const timerRef = useRef(0);
  const {user} = useContext(AccountContext);

  const RadioDemo = () => {
    return (
      <>
        <form>
          <RadioGroup.Root
            className="RadioGroupRoot"
            defaultValue={0}
            aria-label="View density"
          >
            {surveys.map((survey, index) => {
              return (
                <div
                  style={{display: "flex", alignItems: "center"}}
                  key={survey.id}
                >
                  <RadioGroup.Item
                    className="RadioGroupItem"
                    value={index}
                    id={survey.id}
                    onClick={() => {
                      setCurrentSurveyIndex(index);
                      setQuestionId(survey.id);
                      getQuestions(survey.id);
                      setLink(`${siteUrl}/survey/${survey.hash}`);
                    }}
                  >
                    <RadioGroup.Indicator className="RadioGroupIndicator" />
                  </RadioGroup.Item>
                  <label className="Label" htmlFor="r1">
                    {survey.title === "" ? "survey name" : survey.title}
                  </label>
                </div>
              );
            })}
          </RadioGroup.Root>
        </form>
      </>
    );
  };

  const handleCopy = () => {
    window.clearTimeout(timerRef.current);
    setShowCopied(true);
    timerRef.current = window.setTimeout(() => {
      setShowCopied(false);
    }, 3000);
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

  const getQuestions = useCallback(async (survey_id) => {
    try {
      const response = await axios.get(`${endpoint}/questions/${survey_id}`);
      const data = await response.data;
      setQuestions(data);
      loadAnswers(data);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  useEffect(() => {
    if (questionId === 0 && surveys.length > 0) {
      let survey = surveys[0];
      setCurrentSurveyIndex(0);
      setQuestionId(survey.id);
      getQuestions(survey.id);
      setLink(`${siteUrl}/survey/${survey.hash}`);
    }
    // loads surveys for this users
    const loadSurveys = async () => {
      try {
        const response = await axios.get(`${endpoint}/surveys`);
        const data = await response.data;

        setSurveys(data);
      } catch (err) {
        console.error(err.message);
      }

      setLoaded(true);
    };
    if (!loaded) {
      loadSurveys();
    }
  }, [loaded, currentSurveyIndex, questionId, surveys, getQuestions]);

  if (user && !user.confirmed) {
    return <VerifyEmailNotice />;
  }

  if (user && !user.access && !user.premium) {
    return <SubscribeNotice />;
  }

  // <SurveyPreview questions={survey} />
  if (loaded && surveys.length === 0) {
    return <Welcome />;
  }

  return (
    <div className="surveyListParentContainer">
      {surveys.length > 0 && (
        <>
          <div className="surveyListContainer">
            <div className="surveySelectorContainer">
              <div className="listHeader">created surveys</div>
              {RadioDemo()}
            </div>
            <SurveyPreview
              questions={questions}
              surveyTitle={surveys[currentSurveyIndex].title}
              questionId={questionId}
            />
          </div>

          {surveys[currentSurveyIndex].published ? (
            <div className="surveyListLinkContainer">
              <div className="surveyLinkHeaderContainer">
                <div className="surveyLinkHeader">survey link:</div>
                <CopyToClipboard text={link}>
                  <ClipboardCopyIcon
                    className="copyIcon"
                    onClick={handleCopy}
                    style={{width: "20px", height: "20px"}}
                  ></ClipboardCopyIcon>
                </CopyToClipboard>
                {showCopied && (
                  <div className="copiedContainer">
                    <div className="copiedText">copied to clipboard</div>
                    <CheckCircledIcon
                      style={{marginLeft: "3px", marginTop: "3px"}}
                    />
                  </div>
                )}
              </div>
              <div className="surveyLinkDetails">
                (share this link to start surveying your audience)
              </div>
              <code className="surveyLink">
                <a
                  href={link}
                  className="blossomLink"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link}
                </a>
              </code>
            </div>
          ) : (
            <a href="/create">
              <FinishButton>
                finish your draft survey {String.fromCodePoint("0x1F91D")}
              </FinishButton>
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default SurveysList;
