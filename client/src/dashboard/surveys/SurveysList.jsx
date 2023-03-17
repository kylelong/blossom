import React, {useEffect, useState, useRef} from "react";
import {auth} from "../../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";
import axios from "axios";

import SurveyPreview from "../surveyPreview/SurveyPreview";
import Welcome from "../Welcome";
import * as RadioGroup from "@radix-ui/react-radio-group";
import {ClipboardCopyIcon, CheckCircledIcon} from "@radix-ui/react-icons";
import {CopyToClipboard} from "react-copy-to-clipboard";
import "./surveys.css";

const SurveysList = () => {
  const [user] = useAuthState(auth);
  const uid = user.uid;
  const [surveys, setSurveys] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentSurveyIndex, setCurrentSurveyIndex] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const [link, setLink] = useState("");
  const timerRef = useRef(0);

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
                    value={survey.id}
                    id={survey.id}
                    onClick={() => {
                      setCurrentSurveyIndex(index);
                      getQuestions(survey.id);
                      setLink(`http://localhost:3000/survey/${survey.hash}`);
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

  const getQuestions = async (survey_id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/questions/${survey_id}`
      );
      const data = await response.data;
      setQuestions(data);
      loadAnswers(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    // loads surveys for this users
    const loadSurveys = async () => {
      try {
        const response = await axios.get("http://localhost:5000/surveys/1"); //TODO: change usersid to variable
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
  }, [loaded, uid]);

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
              questionId={surveys[currentSurveyIndex].id}
            />
          </div>

          {surveys[currentSurveyIndex].published ? ( //TODO: test for published surveys
            <div className="surveyListLinkContainer">
              <div className="surveyLinkHeaderContainer">
                <div className="surveyLinkHeader">survey link:</div>
                <CopyToClipboard text={link}>
                  <ClipboardCopyIcon
                    className="copyIcon"
                    onClick={handleCopy}
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
              <button
                className="createBtn"
                style={{display: "flex", marginTop: "10px"}}
              >
                finish your draft survey {String.fromCodePoint("0x1F91D")}
              </button>
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default SurveysList;
