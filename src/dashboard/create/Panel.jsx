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
import SurveyPreview from "../surveyPreview/SurveyPreview";
// import Loader from "../../loader";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {auth, app} from "../../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";
import {
  getFirestore,
  serverTimestamp,
  getDocs,
  getDoc,
  deleteDoc,
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

const Panel = () => {
  const {register} = useForm();
  const [surveyName, setSurveyName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionHash, setQuestionHash] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [errors, setErrors] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [surveyStateLoaded, setSurveyStateLoaded] = useState(false);
  const [latestSurveyId, setLatestSurveyId] = useState("");
  const [surveyLink, setSurveyLink] = useState("");
  const [baseSurveyLink, setBaseSurveyLink] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef(0);
  const validUrl =
    // eslint-disable-next-line
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
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
    // start a new survey if no draft
    console.log("hasDraft", hasDraft);
    if (!hasDraft) {
      try {
        let result = await addDoc(collection(db, "surveys"), {
          surveyName: surveyName,
          uid: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          redirectUrl: redirectUrl,
          published: false,
          responseLimit: 0,
          expDate: null,
          survey: questions,
        });
        setLatestSurveyId(result.id);
        const baseUrl = `https://www.blossomsurveys.io/${result.id}`;
        setBaseSurveyLink(baseUrl);
        setSurveyLink(baseUrl);
        console.log("new survey", result.id);
        setHasDraft(true);
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

  const resetSurveyState = () => {
    setQuestions([]);
    setQuestionHash("");
    setRedirectUrl("");
    setErrors([]);
    setSurveyName("");
    setSurveyLink("");
    setBaseSurveyLink("");
    setLatestSurveyId("");
    setHasDraft(false);
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
     * if publishing a draft, merge everything except createdAt
     */
    if (hasDraft) {
      try {
        await setDoc(
          doc(db, "surveys", latestSurveyId),
          {
            survey: questions,
            updatedAt: serverTimestamp(),
            redirectUrl: redirectUrl,
            surveyName: surveyName,
            published: true,
          },
          {merge: true}
        );
        resetSurveyState();
      } catch (err) {
        console.log(err);
      }
    } else {
      // new survey
      try {
        await setDoc(
          collection(db, "surveys", latestSurveyId),
          {
            surveyName: surveyName,
            uid: user.uid,
            updatedAt: serverTimestamp(),
            redirectUrl: redirectUrl,
            published: true,
            responseLimit: 0,
            expDate: null,
            survey: questions,
          },
          {merge: true}
        );
        resetSurveyState();
      } catch (err) {
        console.log(err);
      }
    }
  };
  const updateSurvey = useCallback(async () => {
    if (latestSurveyId) {
      await setDoc(
        doc(db, "surveys", latestSurveyId),
        {
          survey: questions,
          updatedAt: serverTimestamp(),
        },
        {merge: true}
      );
    }
  }, [questions, db, latestSurveyId]);
  const updateSurveyName = async (value) => {
    // TODO: regex
    setSurveyName(value);
    if (latestSurveyId) {
      await setDoc(
        doc(db, "surveys", latestSurveyId),
        {
          surveyName: value,
          updatedAt: serverTimestamp(),
        },
        {merge: true}
      );
    }
  };
  const updateRedirectUrl = async (value) => {
    setRedirectUrl(value);
    if (latestSurveyId) {
      if (value === "") {
        setSurveyLink(baseSurveyLink);
      }
      // can be invalid url just for preview
      if (value.length > 0) {
        let survey_link = baseSurveyLink;
        survey_link = survey_link.concat(`?redirect_url=${value}`);
        setSurveyLink(survey_link);
      }

      if (validUrl.test(value) || value.length === 0) {
        await setDoc(
          doc(db, "surveys", latestSurveyId),
          {
            redirectUrl: value,
            updatedAt: serverTimestamp(),
          },
          {merge: true}
        );
      }
    }
  };
  const deleteSurvey = async () => {
    if (latestSurveyId) {
      console.log(latestSurveyId);
      const surveyDoc = doc(db, "surveys", latestSurveyId);
      const surveyDocSnap = await getDoc(surveyDoc);
      if (surveyDocSnap.exists()) {
        try {
          await deleteDoc(doc(db, "surveys", latestSurveyId));
          resetSurveyState();
        } catch (err) {
          console.log(err);
        }
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

      if (redirectUrl) {
        if (!validUrl.test(redirectUrl)) {
          errs.push("redirect_url must be a valid url");
        }
      }
      if (surveyName === "") {
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
  // sets state to published survey
  const setLatestSurveyState = useCallback(
    async (uid) => {
      // get latest draft
      try {
        const q = query(
          collection(db, "surveys"),
          where("uid", "==", uid),
          where("published", "==", false),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapShot = await getDocs(q);
        if (!querySnapShot.empty) {
          querySnapShot.forEach((doc) => {
            let {survey, surveyName, redirectUrl} = doc.data();
            setSurveyName(surveyName);
            setRedirectUrl(redirectUrl);
            setQuestions(survey);
            setLatestSurveyId(doc.id);
            const baseUrl = `https://www.blossomsurveys.io/${doc.id}`;
            setBaseSurveyLink(baseUrl);
            let link = redirectUrl
              ? `${baseUrl}?redirect_url=${redirectUrl}`
              : baseUrl;
            setSurveyLink(link);
          });
          setHasDraft(true);
        }
      } catch (err) {
        console.log(err);
      }
      setSurveyStateLoaded(true);
    },
    [db]
  );

  useEffect(() => {
    if (surveyName.length === 0) {
      setSurveyName("");
    }

    if (!surveyStateLoaded) {
      setLatestSurveyState(user.uid);
    }
    updateSurvey();
    setLoaded(true);

    return () => clearTimeout(timerRef.current);
  }, [
    surveyName,
    questions,
    redirectUrl,
    errors,
    setLatestSurveyState,
    surveyStateLoaded,
    updateSurvey,
    user.uid,
  ]);
  return (
    <div className="panelContainer">
      {loaded && (
        <SurveyPreview
          questions={questions}
          surveyName={surveyName}
          questionHash={questionHash}
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
                  value={redirectUrl === "" ? "" : redirectUrl}
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
