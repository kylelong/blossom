import React, {useState, useEffect, useCallback, useRef} from "react";
import {useForm} from "react-hook-form";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Label from "@radix-ui/react-label";
import {
  PlusCircledIcon,
  ClipboardCopyIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import QuestionOverview from "./questions/QuestionOverview";
import SurveyPreveiw from "../surveyPreview/SurveyPreview";
import {CopyToClipboard} from "react-copy-to-clipboard";
import "./panel.css";

const Panel = () => {
  const {register, handleSubmit} = useForm();
  const [data, setData] = useState("Survey Name");
  const [surveyName, setSurveyName] = useState("Survey Name");
  const [questions, setQuestions] = useState([]);
  const [questionHash, setQuestionHash] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [errors, setErrors] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const baseSurveyLink =
    "https://www.blossomsurveys.io/d7d8e73c8a47/234rey82fg";
  const [surveyLink, setSurveyLink] = useState(baseSurveyLink);
  const timerRef = useRef(0);
  const addQuestion = () => {
    let data = {
      questionTitle: "",
      index: questions.length,
      questionType: "",
      numberOfAnswerChoices: 0,
      answerChoices: [],
      hash: randomHash(),
    };
    setQuestions((questions) => [...questions, data]);
  };

  const randomHash = () => {
    return Math.random().toString(36).substr(2, 10);
  };

  // update index
  const removeQuestion = (index) => {
    setQuestions((prevState) => {
      const questions = [...prevState];
      questions.splice(index, 1);
      return questions;
    });
  };

  const updateQuestion = useCallback(
    (hash, property, value, answerChoiceIndex) => {
      let copy = [...questions];
      // finds the question
      let index = copy.findIndex((element) => element.hash === hash);
      // property or manipulating answer choices
      // if (questions[index].hasOwnProperty(property)) {
      if (property === "questionTitle") {
        copy[index].questionTitle = value;
      } else if (property === "questionType") {
        copy[index].questionType = value;
        // just in case changing from single or multiselect
        if (value === "emoji_sentiment" || value === "open_ended") {
          copy[index].answerChoices = [];
          copy[index].numberOfAnswerChoices = 0;
        }
      } else if (property === "numberOfAnswerChoices") {
        if (value > 5 || value < 0) return;
        copy[index].numberOfAnswerChoices = value;
      } else if (property === "answerChoices") {
        if (value > 5 || value < 0) return;
        let currLength = copy[index].answerChoices.length;
        //add more options
        if (value > currLength && currLength > 0) {
          for (let i = 0; i < value - currLength; i++) {
            copy[index].answerChoices.push("");
          }
        } else if (value < currLength) {
          //decrease answer choices
          let choices = [];
          for (let i = 0; i < value; i++) {
            choices.push("");
          }
          copy[index].answerChoices = choices;
        } else if (currLength === 0) {
          // empty
          let choices = [];
          for (let i = 0; i < value; i++) {
            choices.push("");
          }
          copy[index].answerChoices = choices;
        }
      } else if (property === "addAnswerChoice") {
        if (value !== null && answerChoiceIndex !== null) {
          let answerChoicesCopy = copy[index].answerChoices;
          answerChoicesCopy[answerChoiceIndex] = value;
          copy[index].answerChoices = answerChoicesCopy;
        }
      } else if (property === "removeAnswerChoice") {
        if (answerChoiceIndex !== null) {
          let answerChoicesCopy = copy[index].answerChoices;
          answerChoicesCopy.splice(answerChoiceIndex, 1);
          copy[index].answerChoices = answerChoicesCopy;
        }
      }
      setQuestions(copy);
      //  }
    },
    [questions]
  );
  /**
   * TODO: function that creates survey
   *  creates survey link /{survey_hash}/user_id
   * make sure to check that these values are not tapered with on survey submission
   * const createSurvey = () => {
   *  //start if no survey is not publised for user
   * }
   *  */
  const publishSurvey = () => {
    console.log("publishing surey");
    console.log(JSON.stringify(questions, null, 2));
    /**
     * survey needs name and my questions
     */
  };
  const deleteSurvey = () => {
    console.log("delete surey");
    /**
     * TODO:
     * firebase logic to delete survey based on id
     *  delete answer and question
     */

    // reset survey
    setQuestions([]);
    setQuestionHash("");
    setRedirectUrl("");
    setErrors([]);
    setSurveyName("Survey Name");
    //TODO: make first add question onclick be the start of the survey
    setSurveyLink(baseSurveyLink);
    // call create survey which generates link
    // TODO: reset survey link with validation url
  };
  const updateRedirectUrl = (value) => {
    // TODO: regex
    if (value === "") {
      setSurveyLink(baseSurveyLink);
    } else {
      let survey_link = baseSurveyLink;
      survey_link = survey_link.concat(`?redirect_url=${value}`);
      setSurveyLink(survey_link);
    }
    setRedirectUrl(value);
  };

  const handleCopy = () => {
    window.clearTimeout(timerRef.current);
    setShowCopied(true);
    console.log(showCopied);
    timerRef.current = window.setTimeout(() => {
      setShowCopied(false);
    }, 3000);
  };

  const checkForErrors = () => {
    if (questions.length > 0) {
      const errs = [];
      setErrors([]);
      const mc = ["multi_select", "single_select"];
      let questionErrorsIndices = [];
      let answerErrorsIndices = [];
      const validUrl =
        // eslint-disable-next-line
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
      if (redirectUrl) {
        if (!validUrl.test(redirectUrl)) {
          errs.push("redirect_url must be a valid url");
        }
      }
      if (surveyName === "Survey Name") {
        errs.push("please enter a name for the survey");
      }
      questions.forEach((question, index) => {
        // blank title or question type
        if (question.questionTitle === "" || question.questionType === "") {
          questionErrorsIndices.push(index + 1);
        }
        if (mc.includes(question.questionType)) {
          // check for no answer choices for multi_select / single_select question
          let hasAnswers = question.answerChoices.every(
            (choice) => choice.length > 0
          );
          if (
            !hasAnswers ||
            question.answerChoices.length === 0 ||
            question.numberOfAnswerChoices === 0
          ) {
            answerErrorsIndices.push(index + 1);
          }
        }
      });
      if (questionErrorsIndices.length > 0) {
        let ids = questionErrorsIndices.join(" ,");
        let lastCommaIndex = ids.lastIndexOf(",");
        if (questionErrorsIndices.length > 1) {
          ids =
            ids.substring(0, lastCommaIndex) +
            " & " +
            ids.substring(lastCommaIndex + 1);
        }

        errs.push(`question(s) ${ids} needs a title and/or question type`);
      }
      if (answerErrorsIndices.length > 0) {
        let ids = answerErrorsIndices.join(", ");
        if (answerErrorsIndices.length > 1) {
          let lastCommaIndex = ids.lastIndexOf(",");
          ids =
            ids.substring(0, lastCommaIndex) +
            " & " +
            ids.substring(lastCommaIndex + 1);
        }

        errs.push(`question(s) ${ids} needs complete answer choices`);
      }
      setErrors(errs);
    }

    // check answers
  };

  useEffect(() => {
    if (surveyName.length === 0) {
      setSurveyName("Survey Name");
    }
    return () => clearTimeout(timerRef.current);

    // console.log(JSON.stringify(questions, null, 2));
  }, [surveyName, questions, redirectUrl, errors]);

  return (
    <div className="panelContainer">
      <SurveyPreveiw
        questions={questions}
        surveyName={surveyName}
        questionHash={questionHash}
      />
      <div className="formContainer">
        <form
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            alignItems: "start",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))}
        >
          <Label.Root className="surveySectionLabel" htmlFor="surveyName">
            Survey Name:
          </Label.Root>
          <input
            {...register("surveyName")}
            onChange={(e) => setSurveyName(e.target.value)}
            className="surveyName"
            type="text"
            name="surveyName"
            id="surveyName"
          />
          <div className="QuestionPanel">
            <Accordion.Root
              className="AccordionRoot"
              type="single"
              defaultValue={`item-${questions.length}`}
              collapsible
            >
              <QuestionOverview
                questions={questions}
                removeQuestion={removeQuestion}
                updateQuestion={updateQuestion}
                updateQuestionHash={setQuestionHash}
              />
            </Accordion.Root>
          </div>
          <div className="panelBtnGroup">
            <button
              className="addQuestionBtn panelBtn"
              onClick={(e) => {
                addQuestion();
                e.preventDefault();
              }}
            >
              Add Question <PlusCircledIcon style={{marginLeft: "5px"}} />
            </button>
            {questions.length > 0 && (
              <>
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <button
                      className="publishBtn panelBtn"
                      type="submit"
                      onClick={() => checkForErrors()}
                    >
                      Publish
                    </button>
                  </AlertDialog.Trigger>
                  {errors.length === 0 && (
                    <>
                      <AlertDialog.Portal>
                        <AlertDialog.Overlay className="AlertDialogOverlay" />
                        <AlertDialog.Content className="AlertDialogContent">
                          <AlertDialog.Title className="AlertDialogTitle">
                            Are you absolutely sure?
                          </AlertDialog.Title>
                          <AlertDialog.Description className="AlertDialogDescription">
                            Share the survey link to start collecting responses
                            :). Once you publish this survey you won't be able
                            to edit it. Delete this survey to begin a new one,
                            otherwise it is saved as a draft until published.
                          </AlertDialog.Description>
                          <div
                            style={{
                              display: "flex",
                              gap: 25,
                              justifyContent: "flex-end",
                            }}
                          >
                            <AlertDialog.Cancel asChild>
                              <button className="Button mauve">Cancel</button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                              <button
                                className="Button green"
                                onClick={() => publishSurvey()}
                              >
                                Yes, publish this survey
                              </button>
                            </AlertDialog.Action>
                          </div>
                        </AlertDialog.Content>
                      </AlertDialog.Portal>
                    </>
                  )}
                </AlertDialog.Root>
              </>
            )}
          </div>
          <div className="errorsContainer">
            {errors.length > 0 && (
              <>
                <div className="errorsHeader">errors:</div>
                <div>
                  {errors.map((err, index) => {
                    return <p key={index}>- {err}</p>;
                  })}
                </div>
              </>
            )}
          </div>
          {surveyLink && (
            <div className="surveyLinkContainer">
              <div className="surveyLinkHeaderContainer">
                <div className="surveyLinkHeader">survey link:</div>
                <CopyToClipboard text={surveyLink}>
                  <ClipboardCopyIcon
                    className="copyIcon"
                    onClick={handleCopy}
                  ></ClipboardCopyIcon>
                </CopyToClipboard>
                {showCopied && (
                  <div className="copiedContainer">
                    <div className="copiedText">copied to clipboard</div>
                    <CheckCircledIcon
                      style={{marginLeft: "3px", marginTop: "3px"}}
                    />
                  </div>
                )}
              </div>
              <div className="surveyLinkDetails">
                (link is active once the survey is published)
              </div>
              <code className="surveyLink">{surveyLink}</code>
              <div className="redirectSection">
                <code className="redirectUrlText">redirect_url</code>
                <span style={{marginLeft: "5px"}}>:</span>
                <input
                  type="text"
                  className="redirectUrl"
                  onChange={(e) => updateRedirectUrl(e.target.value)}
                />
                <div className="surveyLinkDetails">
                  (optional - where the user is sent after completing the
                  survey)
                </div>
              </div>
            </div>
          )}
          {questions.length > 0 && (
            <>
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button
                    className="Button red"
                    id="deleteSurvey"
                    type="submit"
                  >
                    Delete
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="AlertDialogOverlay" />
                  <AlertDialog.Content className="AlertDialogContent">
                    <AlertDialog.Title className="AlertDialogTitle">
                      Are you absolutely sure?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="AlertDialogDescription">
                      This action cannot be reversed. Once you delete this
                      survey, it is permanently gone.
                    </AlertDialog.Description>
                    <div
                      style={{
                        display: "flex",
                        gap: 25,
                        justifyContent: "flex-end",
                      }}
                    >
                      <AlertDialog.Cancel asChild>
                        <button className="Button mauve">Cancel</button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button
                          className="Button red"
                          onClick={() => deleteSurvey()}
                        >
                          Yes, delete survey
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
export default Panel;
