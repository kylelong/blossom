import React from "react";
import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";

const QuestionViewer = ({
  questionTitle,
  index,
  questionType,
  numberOfAnswerChoices,
  answerChoices,
  hash,
}) => {
  return (
    <div className="questionViewerContainer">
      <div className="surveyQuestionTitle">{questionTitle}</div>
      <div>
        {questionType === "multi_select" && (
          <MultiSelect answerChoices={answerChoices} />
        )}
        {questionType === "single_select" && (
          <SingleSelect answerChoices={answerChoices} />
        )}
      </div>
    </div>
  );
};

export default QuestionViewer;
