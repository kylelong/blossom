import React, {useState, useEffect} from "react";
import "./preview.css";
import QuestionViewer from "./QuestionViewer";
import flower from "../../images/scandi-331.svg";
const SurveyPreview = ({questions, surveyName, questionHash}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const showQuestions = questions.length > 0;
  const handleIndex = (buttonAction) => {
    const maxIndex = questions.length - 1;
    if (questions.length > 0) {
      if (buttonAction === "next") {
        if (questionIndex === maxIndex) {
          setQuestionIndex(0);
        } else {
          setQuestionIndex(questionIndex + 1);
        }
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
  }, [questionHash, questions]);
  return (
    <div className="surveyContainer">
      <div className="surveyName">{surveyName}</div>
      {showQuestions && (
        <div className="questionNumber">Question {questionIndex + 1}</div>
      )}
      {!showQuestions && (
        <div className="startSurveyContainer">
          <img src={flower} alt="sunflower" />

          <p className="addDetails">
            Add questions to start creating your new survey &#x1F60A;
          </p>
        </div>
      )}
      {showQuestions && <QuestionViewer {...questions[questionIndex]} />}
      <div className="previewButtonsContainer">
        <button
          className="previewButton"
          name="previous"
          onClick={(e) => {
            handleIndex(e.target.name);
          }}
          style={{marginRight: "75px"}}
        >
          Previous
        </button>
        <button
          className="previewButton"
          name="next"
          onClick={(e) => {
            handleIndex(e.target.name);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default SurveyPreview;
