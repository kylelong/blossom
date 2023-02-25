import React, {useState, useEffect, useRef} from "react";
import "./preview.css";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import QuestionViewer from "./QuestionViewer";
import flower from "../../images/scandi-331.svg";
const SurveyPreview = ({questions, surveyTitle, questionIndex}) => {
  const [index, setIndex] = useState(questionIndex);
  const [answerChoices, setAnswerChoices] = useState([]);
  const showQuestions = questions.length > 0;
  const prevQuestions = useRef(questions);

  const handleIndex = (buttonAction) => {
    const maxIndex = questions.length - 1;
    if (questions.length > 0 && ["next", "previous"].includes(buttonAction)) {
      if (buttonAction === "next") {
        if (index === maxIndex) {
          setIndex(0);
        } else {
          setIndex(index + 1);
        }
      } else if (buttonAction === "previous") {
        if (index === 0) {
          setIndex(maxIndex);
        } else {
          setIndex(index - 1);
        }
      }
    }
  };

  const getAnswers = async () => {
    console.log(questions[index].id, questions[index].type);
    try {
      const response = await axios.get(
        `http://localhost:5000/answer_choices/${questions[index].id}`
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
      //for multi_select && single_select
      getAnswers();
    }
    let idx = questions.findIndex((element) => element.index === index);
    if (idx > -1) {
      setIndex(idx);
    }
    if (JSON.stringify(prevQuestions.current) !== JSON.stringify(questions)) {
      setIndex(0);
    }
    prevQuestions.current = questions;
  }, [questions, index]);
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
          <div className="questionNumber">question {index + 1}</div>
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
            {...questions[index]}
            index={index}
            answerChoices={answerChoices}
          />
        )}
        {questions.length > 0 && (
          <div className="previewButtonsContainer">
            {index > 0 && (
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
            {index !== questions.length - 1 ? (
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
