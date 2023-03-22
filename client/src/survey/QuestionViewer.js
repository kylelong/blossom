import React from "react";
import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";
import OpenEnded from "./OpenEnded";
import Emojis from "./Emojis";
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
  surveyId,
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
                surveyId={surveyId}
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
                surveyId={surveyId}
              />
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
                surveyId={surveyId}
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
                surveyId={surveyId}
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
