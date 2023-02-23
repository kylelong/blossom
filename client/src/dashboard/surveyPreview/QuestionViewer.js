import React, {useEffect} from "react";
import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";
import OpenEnded from "./OpenEnded";
import Emojis from "./Emojis";
import flower from "../../images/sunflower.svg";
const QuestionViewer = ({
  title,
  index,
  type,
  numberOfAnswerChoices,
  answerChoices,
  hash,
  emoji,
}) => {
  const questionStarted =
    title || type || (numberOfAnswerChoices > 0 && answerChoices);
  useEffect(() => {
    console.log(answerChoices, type);
  }, [index]);
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
