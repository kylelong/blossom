import React from "react";
import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";
import OpenEnded from "./OpenEnded";
import Emojis from "./Emojis";
import flower from "../../images/sunflower.svg";
const QuestionViewer = ({
  questionTitle,
  index,
  questionType,
  numberOfAnswerChoices,
  answerChoices,
  hash,
  updateQuestion,
  emoji,
}) => {
  const questionStarted =
    questionTitle.length > 0 ||
    questionType.length > 0 ||
    (numberOfAnswerChoices > 0 && answerChoices.length > 0);
  return (
    <div className="questionViewerContainer">
      {questionStarted && (
        <div className="surveyQuestionTitle">{questionTitle}</div>
      )}
      <div>
        {!questionStarted && (
          <div className="loadingQuestionContainer">
            <img src={flower} alt="sunflower" />

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
        {questionStarted && questionType === "open_ended" && (
          <>
            <OpenEnded />
          </>
        )}
        {questionStarted && questionType === "emoji_sentiment" && (
          <>
            <Emojis
              updateQuestion={updateQuestion}
              questionHash={hash}
              currentEmoji={emoji}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionViewer;
