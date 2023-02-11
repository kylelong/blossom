import React from "react";
import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";
import OpenEnded from "./OpenEnded";
import Emojis from "./Emojis";
import flower from "../images/sunflower.svg";
const QuestionViewer = ({
  questionTitle,
  index,
  questionType,
  numberOfAnswerChoices,
  answerChoices,
  hash,
  emoji,
  handleProceed,
  questionIndex,
  updateResponse,
}) => {
  const questionStarted =
    questionTitle ||
    questionType ||
    (numberOfAnswerChoices > 0 && answerChoices);

  const preview = () => {
    if (questionStarted) {
      switch (questionType) {
        case "multi_select":
          return (
            <>
              <div className="surveyQuestionDetail">select all that apply</div>
              <MultiSelect
                answerChoices={answerChoices}
                index={index}
                handleProceed={handleProceed}
                questionIndex={questionIndex}
                updateResponse={updateResponse}
              />
            </>
          );
        case "single_select":
          return (
            <>
              <div className="surveyQuestionDetail">select one option</div>
              <SingleSelect
                answerChoices={answerChoices}
                handleProceed={handleProceed}
                index={index}
              />
            </>
          );
        case "open_ended":
          return (
            <>
              {" "}
              <OpenEnded handleProceed={handleProceed} index={index} />{" "}
            </>
          );
        case "emoji_sentiment":
          return (
            <>
              <Emojis
                questionHash={hash}
                currentEmoji={emoji}
                index={index}
                handleProceed={handleProceed}
              />
            </>
          );
        default:
          return <></>;
      }
    }
  };
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
              add details to this question to see its preview &#128073;
            </p>
          </div>
        )}
        {preview()}
      </div>
    </div>
  );
};

export default QuestionViewer;
