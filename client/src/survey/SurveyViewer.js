import React, {useState, useEffect, useRef, useCallback} from "react";
import "./survey.css";
import QuestionViewer from "./QuestionViewer";
import Loader from "../loader";
import ThankYou from "./ThankYou";
const SurveyViewer = ({
  questions,
  surveyName,
  questionHash,
  updateResponse,
  submitSurvey,
  redirectUrl,
  surveyHash,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [proceed, setProceed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const hasCompletedSurvey =
    localStorage.getItem("sids") === null
      ? false
      : JSON.parse(localStorage.getItem("sids")).includes(surveyHash);
  const showQuestions = questions.length > 0 && !submitted;
  const prevQuestions = useRef(questions);
  if (hasCompletedSurvey) {
    localStorage.removeItem("bsmr");
  }

  // can go to next question or submit
  const handleProceed = useCallback((proceed) => {
    setProceed(proceed);
  }, []);

  const handleIndex = (buttonAction) => {
    const maxIndex = questions.length - 1;
    if (questions.length > 0 && ["next", "previous"].includes(buttonAction)) {
      if (buttonAction === "next") {
        if (questionIndex === maxIndex) {
          setQuestionIndex(0);
        } else {
          setQuestionIndex(questionIndex + 1);
        }
        setProceed(false);
      } else if (buttonAction === "previous") {
        if (questionIndex === 0) {
          setQuestionIndex(maxIndex);
        } else {
          setQuestionIndex(questionIndex - 1);
        }
      }
    }
  };

  useEffect(() => {
    let index = questions.findIndex((element) => element.hash === questionHash);
    if (index > -1) {
      setQuestionIndex(index);
    }
    if (JSON.stringify(prevQuestions.current) !== JSON.stringify(questions)) {
      setQuestionIndex(0);
    }
    prevQuestions.current = questions;
  }, [questionIndex, questions, questionHash, proceed]);
  return (
    <div className="surveyContainerParent">
      <div className="surveyContainer">
        <div className="surveyNameHeader">
          {showQuestions && surveyName === "" ? "survey name" : surveyName}
        </div>
        {showQuestions && !submitted && !hasCompletedSurvey && (
          <div className="questionNumber">question {questionIndex + 1}</div>
        )}
        {!showQuestions && !submitted && !hasCompletedSurvey && (
          <div className="startSurveyContainer">
            <Loader defaultStyle={false} />
          </div>
        )}
        {showQuestions && !submitted && !hasCompletedSurvey && (
          <QuestionViewer
            {...questions[questionIndex]}
            handleProceed={handleProceed}
            questionIndex={questionIndex}
            updateResponse={updateResponse}
            surveyHash={surveyHash}
          />
        )}
        {submitted || hasCompletedSurvey ? (
          <ThankYou redirectUrl={redirectUrl} surveyHash={surveyHash} />
        ) : null}
        {questions.length > 0 && !hasCompletedSurvey && (
          <div className="previewButtonsContainer">
            {questionIndex > 0 && !submitted && (
              <button
                className="previewButton prevBtn"
                name="previous"
                onClick={(e) => {
                  handleIndex(e.target.name);
                }}
              >
                previous
              </button>
            )}
            {questionIndex !== questions.length - 1 &&
            !submitted &&
            !hasCompletedSurvey ? (
              <button
                className={proceed ? "previewButton" : "disabledButton"}
                name="next"
                onClick={(e) => {
                  handleIndex(e.target.name);
                  setProceed(false);
                }}
                disabled={!proceed}
              >
                next
              </button>
            ) : (
              <>
                {!submitted && !hasCompletedSurvey && (
                  <button
                    className={proceed ? "previewButton" : "disabledButton"}
                    name="submit disabled={!proceed}"
                    onClick={() => {
                      if (proceed) {
                        submitSurvey();
                        setSubmitted(true);
                      }
                    }}
                  >
                    submit
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default SurveyViewer;
