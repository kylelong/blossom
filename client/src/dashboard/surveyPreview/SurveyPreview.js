import React, {useState, useEffect, useRef} from "react";
import "./preview.css";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import QuestionViewer from "./QuestionViewer";
import flower from "../../images/scandi-331.svg";
const SurveyPreview = ({questions, surveyTitle, questionHash}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerChoices, setAnswerChoices] = useState([]);
  const showQuestions = questions.length > 0;
  const prevQuestions = useRef(questions);

  const handleIndex = (buttonAction) => {
    const maxIndex = questions.length - 1;
    if (questions.length > 0 && ["next", "previous"].includes(buttonAction)) {
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

  const getAnswers = async (survey_id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/answer_choices/${questions[questionIndex].id}`
      );
      const data = await response.data;
      console.log(data);
      setAnswerChoices(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (questions.length) {
      console.log(questions[questionIndex].id);
      getAnswers();
    }

    // let index = questions.findIndex((element) => element.hash === questionHash);
    // if (index > -1) {
    //   setQuestionIndex(index);
    // }
    // if (JSON.stringify(prevQuestions.current) !== JSON.stringify(questions)) {
    //   setQuestionIndex(0);
    // }
    prevQuestions.current = questions;
  }, [questions, questionIndex]);
  return (
    <div className="surveyContainerParent">
      <Label.Root className="surveySectionLabel" htmlFor="surveyTitle">
        survey preview:
      </Label.Root>
      <div className="surveyContainer">
        <div className="surveyNameHeader">
          {surveyTitle === "" ? "survey name" : surveyTitle}
        </div>
        {showQuestions && (
          <div className="questionNumber">question {questionIndex + 1}</div>
        )}
        {!showQuestions && (
          <div className="startSurveyContainer">
            <img src={flower} alt="sunflower" />

            <p className="addDetails">
              add questions to start creating your new survey &#x1F60A;
            </p>
          </div>
        )}
        {showQuestions && (
          <QuestionViewer
            {...questions[questionIndex]}
            index={questionIndex}
            answerChoices={answerChoices}
          />
        )}
        {questions.length > 0 && (
          <div className="previewButtonsContainer">
            {questionIndex > 0 && (
              <button
                className="previewButton"
                name="previous"
                onClick={(e) => {
                  handleIndex(e.target.name);
                }}
                style={{marginRight: "75px"}}
              >
                previous
              </button>
            )}
            {questionIndex !== questions.length - 1 ? (
              <button
                className="previewButton"
                name="next"
                onClick={(e) => {
                  handleIndex(e.target.name);
                }}
              >
                next
              </button>
            ) : (
              <>
                <button className="previewButton" name="submit">
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
export default SurveyPreview;
