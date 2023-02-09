import React, {useState, useEffect, useRef, useCallback} from "react";
import "./survey.css";
import QuestionViewer from "./QuestionViewer";
import Loader from "../loader";
const SurveyViewer = ({questions, surveyName, questionHash}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [proceed, setProceed] = useState(false);
  const showQuestions = questions.length > 0;
  const prevQuestions = useRef(questions);

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
        {showQuestions && (
          <div className="questionNumber">question {questionIndex + 1}</div>
        )}
        {!showQuestions && (
          <div className="startSurveyContainer">
            <Loader defaultStyle={false} />
          </div>
        )}
        {showQuestions && (
          <QuestionViewer
            {...questions[questionIndex]}
            handleProceed={handleProceed}
            questionIndex={questionIndex}
          />
        )}
        {questions.length > 0 && (
          <div className="previewButtonsContainer">
            {questionIndex > 0 && (
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
            {questionIndex !== questions.length - 1 ? (
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
                <button
                  className={proceed ? "previewButton" : "disabledButton"}
                  name="submit disabled={!proceed}"
                >
                  submit
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default SurveyViewer;
