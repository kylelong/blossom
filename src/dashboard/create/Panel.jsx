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
import Loader from "../../loader";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {auth, app} from "../../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";
import {
  getFirestore,
  serverTimestamp,
  getDocs,
  where,
  query,
  addDoc,
  limit,
  orderBy,
  collection,
  setDoc,
  doc,
} from "firebase/firestore";
import "./panel.css";
import {redirect} from "react-router-dom";

const Panel = () => {
  const {register, handleSubmit} = useForm();
  const [data, setData] = useState("survey name");
  const [surveyName, setSurveyName] = useState("survey name");
  const [questions, setQuestions] = useState([]);
  const [questionHash, setQuestionHash] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [errors, setErrors] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [surveyStateLoaded, setSurveyStateLoaded] = useState(false);
  const [latestSurveyId, setLatestSurveyId] = useState("");
  const baseSurveyLink =
    "https://www.blossomsurveys.io/d7d8e73c8a47/234rey82fg";
  const [surveyLink, setSurveyLink] = useState(baseSurveyLink);
  const timerRef = useRef(0);
  const [user] = useAuthState(auth);
  const db = getFirestore(app);

  const addQuestion = async () => {
    /**
     *
     * **/
    let data = {
      questionTitle: "",
      index: questions.length,
      questionType: "",
      numberOfAnswerChoices: 0,
      answerChoices: [],
      hash: randomHash(),
    };
    setQuestions((questions) => [...questions, data]);
    // start a new survey if HAS_DRAFT_SURVEY === false
    if (!localStorage.getItem("HAS_DRAFT_SURVEY")) {
      try {
        let result = await addDoc(collection(db, "surveys"), {
          surveyName: surveyName,
          uid: user.uid,
          createdAt: serverTimestamp(),
          redirectUrl: redirectUrl,
          published: false,
          responseLimit: 0,
          expDate: null,
          survey: questions,
        });
        setLatestSurveyId(result.id);
        console.log("new survey", result.id);
      } catch (err) {
        console.log(err);
      }
    }
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
  const publishSurvey = async () => {
    console.log("publishing surey");
    console.log(JSON.stringify(questions, null, 2));
    /**
     * survey needs meta data before questions and questions
     * sending to analytics / surveys
     *
     * TODO: only if published === false do we want to set createdAt
     */
    try {
      await addDoc(collection(db, "surveys"), {
        surveyName: surveyName,
        uid: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        redirectUrl: redirectUrl,
        published: true,
        responseLimit: 0,
        expDate: null,
        survey: questions,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const updateSurvey = async () => {
    if (latestSurveyId) {
      await setDoc(
        doc(db, "surveys", latestSurveyId),
        {
          survey: questions,
        },
        {merge: true}
      );
    }
  };
  const updateSurveyName = async (value) => {
    setSurveyName(value);
    // TODO: make sure only draft is being edit
    // latestSurveyId is ONLY set for draft
    if (latestSurveyId) {
      await setDoc(
        doc(db, "surveys", latestSurveyId),
        {
          surveyName: value,
        },
        {merge: true}
      );
    }
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
      if (surveyName === "survey name") {
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
  // always get latest state despite local storage key
  const setLatestSurveyState = useCallback(
    async (uid) => {
      // draft
      const q = query(
        collection(db, "surveys"),
        where("uid", "==", uid),
        where("published", "==", false),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const querySnapShot = await getDocs(q);
      if (querySnapShot.empty) {
        console.log("empty");
        localStorage.setItem("HAS_DRAFT_SURVEY", false);
      } else {
        localStorage.setItem("HAS_DRAFT_SURVEY", true);
        querySnapShot.forEach((doc) => {
          let {published, survey, surveyName, redirectUrl} = doc.data();
          console.log(published, survey, surveyName, redirectUrl);
          setSurveyName(surveyName);
          setRedirectUrl(redirectUrl);
          setQuestions(survey);
          setLatestSurveyId(doc.id);
          // TODO: add redirect_url if not blank then
          let link = `https://www.blossomsurveys.io/${doc.id}/${uid}`;
          setSurveyLink(link);
        });
      }
      setSurveyStateLoaded(true);
    },
    [db]
  );

  useEffect(() => {
    if (surveyName.length === 0) {
      setSurveyName("Survey Name");
    }
    console.log(user.uid);

    if (!surveyStateLoaded) {
      setLatestSurveyState(user.uid);
    }
    console.log("--- ");
    updateSurvey();

    return () => clearTimeout(timerRef.current);

    // console.log(JSON.stringify(questions, null, 2));
  }, [surveyName, questions, redirectUrl, errors, setLatestSurveyState]);
  // if (!surveyStateLoaded) {
  //   return <></>;
  // }
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
            survey name:
          </Label.Root>
          <input
            {...register("surveyName")}
            onChange={(e) => updateSurveyName(e.target.value)}
            className="surveyName"
            type="text"
            name="surveyName"
            value={surveyName === "" ? "" : surveyName}
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
              add question <PlusCircledIcon style={{marginLeft: "5px"}} />
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
                            share the survey link to start collecting responses
                            :). once you publish this survey you won't be able
                            to edit it. delete this survey to begin a new one,
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
                              <button className="Button mauve">cancel</button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                              <button
                                className="Button green"
                                onClick={() => publishSurvey()}
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
                          onClick={() => deleteSurvey()}
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
