import React from "react";

const QuestionViewer = ({
  questionTitle,
  index,
  questionType,
  numberOfAnswerChoices,
  answerChoices,
  hash,
}) => {
  const multipleChoice =
    questionType === "multi_select" || questionType === "single_select";
  return (
    <div>
      <div>{questionTitle}</div>
      <div>
        {multipleChoice &&
          answerChoices.map((choice, index) => {
            return <div key={index}>{choice}</div>;
          })}
      </div>
    </div>
  );
};

export default QuestionViewer;
