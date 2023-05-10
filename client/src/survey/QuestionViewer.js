import React from "react";
import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";
import OpenEnded from "./OpenEnded";
import Emojis from "./Emojis";
import ShortAnswer from "./ShortAnswer";
import flower from "../images/sunflower.svg";
const QuestionViewer = ({
  title,
  index,
  type,
  answerChoices,
  hash,
  handleProceed,
  questionIndex,
  updateResponse,
  surveyHash,
}) => {
  const questionStarted =
    title || type || (answerChoices && answerChoices.length);

  const preview = () => {
    if (questionStarted) {
      switch (type) {
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
                surveyHash={surveyHash}
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
                updateResponse={updateResponse}
                surveyHash={surveyHash}
              />
            </>
          );
        case "short_answer":
          return (
            <>
              {" "}
              <ShortAnswer
                handleProceed={handleProceed}
                index={index}
                updateResponse={updateResponse}
                surveyHash={surveyHash}
              />{" "}
            </>
          );
        case "open_ended":
          return (
            <>
              {" "}
              <OpenEnded
                handleProceed={handleProceed}
                index={index}
                updateResponse={updateResponse}
                surveyHash={surveyHash}
              />{" "}
            </>
          );
        case "emoji_sentiment":
          return (
            <>
              <Emojis
                index={index}
                handleProceed={handleProceed}
                updateResponse={updateResponse}
                surveyHash={surveyHash}
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
      {questionStarted && <div className="surveyQuestionTitle">{title}</div>}
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
