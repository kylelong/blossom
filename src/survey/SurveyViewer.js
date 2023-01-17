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
  const handleProceed = useCallback(
    (proceed) => {
      setProceed(proceed);
    },
    [questionIndex]
  );

  const handleIndex = (buttonAction) => {
    const maxIndex = questions.length - 1;
    if (questions.length > 0 && ["next", "previous"].includes(buttonAction)) {
      if (buttonAction === "next") {
        console.log("clicked next", proceed);
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
  }, [questions, questionHash, questionIndex, proceed]);
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
            {questionIndex !== questions.length - 1 && proceed ? (
              <button
                className="previewButton nextBtn"
                name="next"
                onClick={(e) => {
                  handleIndex(e.target.name);
                }}
              >
                next
              </button>
            ) : (
              <>
                {proceed && (
                  <button className="previewButton" name="submit">
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
