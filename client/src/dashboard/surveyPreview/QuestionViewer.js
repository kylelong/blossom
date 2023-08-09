import React from "react";
import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";
import OpenEnded from "./OpenEnded";
import ShortAnswer from "./ShortAnswer";
import Emojis from "./Emojis";
import Number from "./Number";
import flower from "../../images/sunflower.svg";
const QuestionViewer = ({id, title, type, answerChoices, hash, emoji}) => {
  const questionStarted =
    (title && title.length > 0) || (type && type.length > 0); // title, type, can be changes by user
  const types = ["emoji_sentiment", "short_answer"];
  let dynamicStyle = {
    marginTop: types.includes(type) ? "100px" : "30px",
  };
  if (type === "open_ended") {
    dynamicStyle = {
      marginTop: "75px",
    };
  }
  const preview = () => {
    if (questionStarted) {
      switch (type) {
        case "multi_select":
          return (
            <>
              <div className="surveyQuestionDetail">select all that apply</div>
              <MultiSelect answerChoices={answerChoices} />
            </>
          );
        case "single_select":
          return (
            <>
              <div className="surveyQuestionDetail">select one option</div>
              <SingleSelect answerChoices={answerChoices} />
            </>
          );
        case "short_answer":
          return (
            <>
              {" "}
              <ShortAnswer />{" "}
            </>
          );
        case "open_ended":
          return (
            <>
              {" "}
              <OpenEnded />{" "}
            </>
          );
        case "emoji_sentiment":
          return (
            <>
              <Emojis questionHash={hash} currentEmoji={emoji} />
            </>
          );
        case "number":
          return (
            <>
              <div className="surveyQuestionDetail">enter a number</div>
              <Number />
            </>
          );
        default:
          return <></>;
      }
    }
  };
  return (
    <div className="questionViewerContainer" style={dynamicStyle}>
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
