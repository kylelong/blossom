import React from "react";
import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";
import flower from "../../images/sunflower.svg";
const QuestionViewer = ({
  questionTitle,
  index,
  questionType,
  numberOfAnswerChoices,
  answerChoices,
  hash,
}) => {
  const questionStarted =
    questionTitle || (numberOfAnswerChoices > 0 && answerChoices.length > 0);
  return (
    <div className="questionViewerContainer">
      {questionStarted && (
        <div className="surveyQuestionTitle">{questionTitle}</div>
      )}
      <div>
        {!questionStarted && (
          <div className="loadingQuestionContainer">
            <img src={flower} />

            <p className="addDetails">
              Add details to this question to see its preview &#128073;
            </p>
          </div>
        )}
        {questionStarted && questionType === "multi_select" && (
          <>
            <div className="surveyQuestionDetail">select all that apply</div>
            <MultiSelect answerChoices={answerChoices} />
          </>
        )}
        {questionStarted && questionType === "single_select" && (
          <>
            <div className="surveyQuestionDetail">select one option</div>
            <SingleSelect answerChoices={answerChoices} />
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionViewer;
