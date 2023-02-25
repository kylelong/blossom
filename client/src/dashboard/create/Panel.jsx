import React, {useState, useEffect, useCallback, useRef} from "react";
import {useForm} from "react-hook-form";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import {
  PlusCircledIcon,
  ClipboardCopyIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import QuestionOverview from "./questions/QuestionOverview";
import SurveyPreview from "../surveyPreview/SurveyPreview";
// import Loader from "../../loader";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {auth} from "../../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";
import "./panel.css";

const endpoint = "http://localhost:5000";

const Panel = () => {
  const {register} = useForm();
  const [draft, setDraft] = useState({
    hash: "",
    id: 0,
    published: false,
    redirect_url: "",
    title: "",
  });
  const [surveyName, setSurveyName] = useState("");
  const [questions, setQuestions] = useState([]); // load questions
  const [questionId, setQuestionId] = useState(0);
  const [errors, setErrors] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [surveyStateLoaded, setSurveyStateLoaded] = useState(false);
  const [surveyLink, setSurveyLink] = useState("");
  const [baseSurveyLink, setBaseSurveyLink] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef(0);
  const validUrl =
    // eslint-disable-next-line
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
  const [user] = useAuthState(auth); // TODO: get user_id from postgres

  const addQuestion = async () => {
    /**
     * insert question in question table with survey_id & questions.legnth as index
     *  draft is updated with id: survey_id and
     * **/
    let data = {
      title: "",
      index: questions.length,
      type: "",
      numberOfAnswerChoices: 0,
      answerChoices: [],
    };
    //TODO: // use numberOfAnswerChoices to set number of questions for survey
    // TODO: Insert question
    // start a new survey if no draft
    console.log("hasDraft", hasDraft);
    if (hasDraft) {
      // add question to current draft
      try {
        const response = await axios.post(`${endpoint}/add_question`, {
          survey_id: draft.id,
          index: questions.length,
        });
        data.id = response.data.id;
      } catch (err) {
        console.error(err.message);
      }
    } else {
      try {
        // TODO: Create survey
        /**
         *  
         *  try {
        const response = await axios.post(`${endpoint}/create_survey`, {
          title: draft.title,
          hash: '',
          user_id:
        });
      } catch (err) {
        console.error(err.message);
      }
         */
        // call /create_survey with hash, title, user_id
        // set draft to what is return (id,hash)
        // setLatestSurveyId(result.id);
        // const baseUrl = `https://www.blossomsurveys.io/${result.id}`;
        // setBaseSurveyLink(baseUrl);
        // setSurveyLink(baseUrl);
        // setHasDraft(true);
      } catch (err) {
        console.error(err.message);
      }
    }
    setQuestions((questions) => [...questions, data]);
  };

  // const randomHash = () => {
  //   return Math.random().toString(36).substr(2, 10);
  // };

  // update index
  const removeQuestion = async (index) => {
    const question_id = questions[index].id;
    try {
      const response = await axios.delete(
        `${endpoint}/delete_survey/${draft.id}/${question_id}`
      );
      console.log(`remove questions: ${response.data}`);
    } catch (err) {
      console.error(err.message);
    }
    setQuestions((prevState) => {
      const questions = [...prevState];
      questions.splice(index, 1);
      return questions;
    });
  };

  const resetSurveyState = () => {
    setDraft({});
    setQuestions([]);
    setQuestionId(0);
    setErrors([]);
    setSurveyName("");
    setSurveyLink("");
    setBaseSurveyLink("");

    setHasDraft(false);
  };

  const updateQuestion = useCallback(
    (id, property, value, answerChoiceIndex) => {
      let copy = [...questions];
      // finds the question
      let index = copy.findIndex((element) => element.id === id);
      // property or manipulating answer choices
      if (property === "title") {
        copy[index].title = value;
      } else if (property === "type") {
        copy[index].type = value;
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
    },
    [questions]
  );
  /**
   * TODO: function that creates survey
   * make sure to check that these values are not tapered with on survey submission
   * const createSurvey = () => {
   *  //start if no survey is not publised for user
   * }
   *  */
  const publishSurvey = async () => {
    if (hasDraft) {
      try {
        const response = await axios.put(
          `${endpoint}/publish_survey/${draft.id}`
        );
        console.log(`publishing survey: `, response.data);
        resetSurveyState();
      } catch (err) {
        console.error(err.message);
      }
    }
    window.location.href = "/surveys";
  };

  const updateSurveyTitle = async (value) => {
    // TODO: regex

    if (draft.id > 0) {
      const response = await axios.put(
        `${endpoint}/update_survey_title/${draft.id}`,
        {title: value}
      );
      console.log(`update survey title ${response.data}`);

      setDraft({...draft, title: value});
    }
  };
  const updateRedirectUrl = async (value) => {
    if (draft.id) {
      if (value === "") {
        setSurveyLink(baseSurveyLink);
        setDraft({...draft, redirect_url: baseSurveyLink});
      }
      // can be invalid url just for preview
      if (value.length > 0) {
        let survey_link = baseSurveyLink;
        survey_link = survey_link.concat(`?redirect_url=${value}`);
        setDraft({...draft, redirect_url: survey_link});
        setSurveyLink(survey_link);
      }

      if (validUrl.test(value) || value.length === 0) {
        try {
          const response = await axios.put(
            `${endpoint}/update_redirect_url/${draft.id}`,
            {redirect_url: value}
          );
          setDraft({...draft, redirect_url: value});
          console.log(`update url: ${response.data}`);
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  };
  const deleteSurvey = async () => {
    if (draft.id) {
      try {
        const response = await axios.get(
          `${endpoint}/delete_survey/${draft.id}`
        );
        console.log(`delete survey: ${response.data}`);
        resetSurveyState();
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  const handleCopy = () => {
    window.clearTimeout(timerRef.current);
    setShowCopied(true);
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

      if (draft.redirect_url) {
        if (!validUrl.test(draft.redirect_url)) {
          errs.push("redirect_url must be a valid url");
        }
      }
      if (surveyName === "") {
        errs.push("please enter a name for the survey");
      }
      questions.forEach((question, index) => {
        // blank title or question type
        if (question.title === "" || question.type === "") {
          questionErrorsIndices.push(index + 1);
        }
        if (mc.includes(question.type)) {
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
        let ids = questionErrorsIndices.join(",");
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
        let ids = answerErrorsIndices.join(",");
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
  const loadQuestions = async (survey_id) => {
    try {
      const response = await axios.get(`${endpoint}/questions/${survey_id}`);
      const data = await response.data;
      console.log(data);
      setQuestions(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  // sets state to published survey
  const setLatestSurveyState = useCallback(
    async (uid) => {
      // get draft (if it exists)
      try {
        const id = 1;
        const response = await axios.get(`${endpoint}/latest_survey/${id}`);
        const data = await response.data;
        if (data && data.length) {
          setDraft(data[0]);
          const baseUrl = `https://www.blossomsurveys.io/${data[0].hash}`;
          setBaseSurveyLink(baseUrl);
          let link = draft.redirect_url
            ? `${baseUrl}?redirect_url=${draft.redirect_url}`
            : baseUrl;
          setSurveyLink(link);
          setHasDraft(true);

          loadQuestions(data[0].id);

          // TODO: set questions
        }
      } catch (err) {
        console.error(err.message);
      }

      setSurveyStateLoaded(true);
    },
    [draft.redirect_url]
  );

  useEffect(() => {
    if (surveyName && surveyName.length === 0) {
      setSurveyName("");
    }

    if (!surveyStateLoaded) {
      setLatestSurveyState(user.uid);
    }

    setLoaded(true);

    return () => clearTimeout(timerRef.current);
  }, [
    surveyName,
    questions,
    draft.redirect_url,
    errors,
    setLatestSurveyState,
    surveyStateLoaded,
    user.uid,
  ]);
  return (
    <div className="panelContainer">
      {/* <div>{JSON.stringify(draft, null, 2)}</div> */}
      {/* <div>{draft.title}</div> */}
      {loaded && (
        <SurveyPreview
          questions={questions}
          surveyName={surveyName}
          questionIndex={0}
        />
      )}
      <div className="formContainer">
        <form
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            alignItems: "start",
            flexDirection: "column",
          }}
        >
          <Label.Root className="surveySectionLabel" htmlFor="surveyName">
            survey name:
          </Label.Root>
          <input
            {...register("surveyName")}
            onChange={(e) => updateSurveyTitle(e.target.value)}
            className="surveyName"
            type="text"
            name="surveyName"
            value={draft.title === "" ? "" : draft.title}
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
                updateQuestionId={setQuestionId}
              />
            </Accordion.Root>
          </div>
          <div className="panelBtnGroup">
            <button
              className="addQuestionBtn panelBtn"
              onClick={(e) => {
                e.preventDefault();
                addQuestion();
              }}
            >
              add question <PlusCircledIcon style={{marginLeft: "5px"}} />
            </button>
            {questions.length > 0 && (
              <>
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <button
                      className="publishBtn panelBtn"
                      onClick={() => {
                        checkForErrors();
                      }}
                    >
                      publish
                    </button>
                  </AlertDialog.Trigger>
                  {errors.length === 0 && (
                    <>
                      <AlertDialog.Portal>
                        <AlertDialog.Overlay className="AlertDialogOverlay" />
                        <AlertDialog.Content className="AlertDialogContent">
                          <AlertDialog.Title className="AlertDialogTitle">
                            are you absolutely sure?
                          </AlertDialog.Title>
                          <AlertDialog.Description className="AlertDialogDescription">
                            share the{" "}
                            <span className="surveyLinkText">survey link </span>
                            to start collecting responses :). once you publish
                            this survey you won't be able to edit it. delete
                            this survey to begin a new one, otherwise it is
                            saved as a draft until published.
                          </AlertDialog.Description>
                          <div
                            style={{
                              display: "flex",
                              gap: 25,
                              justifyContent: "flex-end",
                            }}
                          >
                            <AlertDialog.Cancel asChild>
                              <button className="Button mauve">cancel</button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                              <button
                                className="Button green"
                                onClick={() => {
                                  publishSurvey();
                                }}
                              >
                                yes, publish this survey
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
                  value={draft.redirect_url === "" ? "" : draft.redirect_url}
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
                  <button className="Button red" id="deleteSurvey">
                    delete
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="AlertDialogOverlay" />
                  <AlertDialog.Content className="AlertDialogContent">
                    <AlertDialog.Title className="AlertDialogTitle">
                      are you absolutely sure?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="AlertDialogDescription">
                      this action cannot be reversed. once you delete this
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
                          onClick={() => {
                            deleteSurvey();
                          }}
                        >
                          yes, delete survey
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
