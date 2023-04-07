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
import {CopyToClipboard} from "react-copy-to-clipboard";
import randomstring from "randomstring";
import {auth} from "../../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";
import "./panel.css";

const endpoint = process.env.REACT_APP_LOCALHOST_URL;

const Panel = () => {
  const {register} = useForm();
  // survey
  const [draft, setDraft] = useState({
    hash: "",
    id: 0,
    published: false,
    redirect_url: "",
    title: "",
  });

  const [surveyTitle, setSurveyTitle] = useState("");
  const [questions, setQuestions] = useState([]); // load questions
  const [questionId, setQuestionId] = useState(0);
  const [errors, setErrors] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [surveyStateLoaded, setSurveyStateLoaded] = useState(false);
  const [surveyLink, setSurveyLink] = useState("");
  const [baseSurveyLink, setBaseSurveyLink] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const timerRef = useRef(0);
  const validUrl =
    // eslint-disable-next-line
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
  const [user] = useAuthState(auth); // TODO: get user_id from postgres

  const loadQuestions = useCallback(async (survey_id) => {
    try {
      const response = await axios.get(`${endpoint}/questions/${survey_id}`);
      const data = await response.data;

      if (data && data.length) {
        setQuestions(data);
        loadAnswers(data);
      }
    } catch (err) {
      console.error(err.message);
    }
  }, []);
  //
  const loadAnswers = async (questions) => {
    let question_copy = [];
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];

      let {id} = question;
      let question_array = questions.filter((question) => question.id === id);

      try {
        const response = await axios.get(`${endpoint}/answer_choices/${id}`);
        const data = await response.data;
        question_array[0].answerChoices = data;
        question_copy.push(question_array);
      } catch (err) {
        console.error(err.message);
      }
    }

    setQuestions(question_copy.flat());
  };

  // sets state to published survey
  const loadSurvey = useCallback(async () => {
    // get draft (if it exists)
    try {
      const id = 1; //TODO: user_id from db
      const response = await axios.get(`${endpoint}/latest_survey/${id}`);
      const data = await response.data;
      if (data && data.length) {
        setDraft(data[0]);
        const baseUrl = `https://www.blossomsurveys.io/${data[0].hash}`;
        setBaseSurveyLink(baseUrl);
        let link =
          draft.redirect_url.length > 0
            ? `${baseUrl}?redirect_url=${draft.redirect_url}`
            : baseUrl;
        setSurveyLink(link);
        setSurveyTitle(data[0].title);
        setHasDraft(true);

        loadQuestions(data[0].id);
      }
      setSurveyStateLoaded(true);
    } catch (err) {
      console.error(err.message);
    }
  }, [draft.redirect_url, loadQuestions]);

  const createSurvey = async (data) => {
    try {
      let hash = randomstring.generate({
        length: 20,
        charset: "alphanumeric",
      });
      // create survey with unique hash

      const response = await axios.post(`${endpoint}/create_survey`, {
        title: surveyTitle,
        hash: hash, // how to autogenerate hash in post
        user_id: 1, //TODO: pull from logged in user
      });
      setDraft(response.data);
      let survey_id = response.data.id;

      // call /create_survey with hash, title, user_id
      // set draft to what is return (id,hash)
      const baseUrl = `https://www.blossomsurveys.io/${response.data.hash}`;
      setBaseSurveyLink(baseUrl);
      setSurveyLink(baseUrl);
      setHasDraft(true);

      // /add_question
      try {
        hash = randomstring.generate({
          length: 16,
          charset: "alphanumeric",
        });
        const response = await axios.post(`${endpoint}/add_question`, {
          survey_id: survey_id,
          index: questions.length,
          hash: hash,
        });
        data.id = response.data.id;
        setQuestions((questions) => [...questions, data]);
      } catch (err) {
        console.error(err.message);
      }
      // if was typing before survey started
      if (surveyTitle.length > 0) {
        try {
          await axios.put(`${endpoint}/update_survey_title/${draft.id}`, {
            title: surveyTitle,
          });
        } catch (err) {
          console.error(err.message);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const addQuestion = async () => {
    /**
     * insert question in question table with survey_id & questions.legnth as index
     *  draft is updated with id: survey_id and
     * **/
    let hash = randomstring.generate({
      length: 16,
      charset: "alphanumeric",
    });
    let data = {
      title: "",
      index: questions.length,
      type: "",
      answerChoices: [],
      hash: hash,
    };
    // TODO: Insert question
    // start a new survey if no draft
    if (hasDraft) {
      // add question to current draft
      try {
        const response = await axios.post(`${endpoint}/add_question`, {
          survey_id: draft.id,
          index: questions.length,
          hash: hash,
        });
        data.id = response.data.id;
        setQuestions((questions) => [...questions, data]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      createSurvey(data);
    }
  };

  // delete question when delete survey, no reload or state change needed
  const deleteQuestion = async (id) => {
    // delete answers first
    deleteAnswerChoices(id);

    // delete question
    try {
      await axios.delete(`${endpoint}/delete_question/${id}`);
    } catch (err) {
      console.error(err.message);
    }
  };

  // update index
  const removeQuestion = async (id) => {
    // remove answers first because they reference question id
    await removeAnswerChoices(id);

    // delete question
    try {
      const response = await axios.delete(`${endpoint}/delete_question/${id}`);
      let idx = getQuestionIndex(response.data.id);
      setQuestions((prevState) => {
        const questions = [...prevState];
        questions.splice(idx, 1);
        return questions;
      });
    } catch (err) {
      console.error(err.message);
    }

    // update indices for other questions

    // remove 1 + removal question start index
    let start = questions.findIndex((question) => question.id === id);
    if (start !== questions.length - 1) {
      // no need to update index if last question was removed
      for (let i = start + 1; i < questions.length; i++) {
        let {id, index} = questions[i];

        try {
          const response = await axios.put(
            `${endpoint}/update_question_index/${draft.id}`,
            {
              question_id: id,
              question_index: index,
            }
          );
          let copy = [...questions];
          let idx = getQuestionIndex(id);
          copy[idx].index = response.data.index;
          setQuestions(copy);
        } catch (err) {
          console.error(err.message);
        }
      }
    }
    if (questions && questions.length > 0) {
      setQuestionId(questions[0].id);
    }
    if (questions.length === 0) {
      setQuestionId(0);
    }

    loadSurvey(); // reload beacause questionOverView accordian keeps last question id open
  };

  const resetSurveyState = () => {
    setDraft({});
    setQuestions([]);
    setQuestionId(0);
    setErrors([]);
    setSurveyTitle("");
    setSurveyLink("");
    setBaseSurveyLink("");
    setHasDraft(false);
    setShowCopied(false);
    setSurveyStateLoaded(false);
  };

  const getQuestionIndex = useCallback(
    (question_id) => {
      return questions.findIndex((element) => element.id === question_id);
    },
    [questions]
  );

  const addAnswerChoice = useCallback(
    async (choice, index, question_id) => {
      try {
        let hash = randomstring.generate({
          length: 24,
          charset: "alphanumeric",
        });
        const response = await axios.post(
          `${endpoint}/add_answer_choice/${question_id}`,
          {
            choice: choice,
            index: index,
            hash,
          }
        );
        let copy = [...questions];
        let idx = getQuestionIndex(question_id);
        copy[idx].answerChoices.push(response.data);
        setQuestions(copy);
      } catch (err) {
        console.error(err.message);
      }
    },
    [getQuestionIndex, questions]
  );
  const updateAnswerChoice = useCallback(
    async (question_id, answer_id, choice) => {
      try {
        await axios.put(`${endpoint}/update_answer_choice/${question_id}`, {
          answer_id: answer_id,
          choice: choice,
        });
        let copy = [...questions];
        let question = copy.filter((q) => q.id === question_id);
        question[0].answerChoices.filter(
          (ac) => ac.id === answer_id
        )[0].choice = choice;
        setQuestions(copy);
      } catch (err) {
        console.error(err.message);
      }
    },
    [questions]
  );
  // when deleting survey but no state change
  const deleteAnswerChoices = async (question_id) => {
    try {
      await axios.delete(`${endpoint}/delete_answers/${question_id}`);
    } catch (err) {
      console.error(err.message);
    }
  };
  // delete all answer choices for a question
  const removeAnswerChoices = useCallback(
    async (question_id) => {
      try {
        await axios.delete(`${endpoint}/delete_answers/${question_id}`);
        let copy = [...questions];
        let idx = getQuestionIndex(question_id);
        copy[idx].answerChoices = [];
        setQuestions(copy);
      } catch (err) {
        console.error(err.message);
      }
    },
    [getQuestionIndex, questions]
  );
  // remove single answer for question
  const removeAnswer = useCallback(
    async (answer_id) => {
      // find index of the answer
      let copy = [...questions];
      let question = copy.filter((q) => q.id === questionId);
      let start = question[0].answerChoices.findIndex(
        (ac) => ac.id === answer_id
      );

      try {
        await axios.delete(`${endpoint}/delete_answer_choice/${answer_id}`);
      } catch (err) {
        console.error(err.message);
      }

      /**
       * update all indices of other answer choices
       */
      let answer_choices = question[0].answerChoices;
      if (start !== answer_choices.length - 1) {
        for (let i = start + 1; i < answer_choices.length; i++) {
          let {id, index} = answer_choices[i];
          try {
            await axios.put(`${endpoint}/update_answer_index/${questionId}`, {
              answer_index: index,
              answer_id: id,
            });
          } catch (err) {
            console.error(err.message);
          }
        }
      }
      loadSurvey();
    },
    [loadSurvey, questionId, questions]
  );

  const updateQuestionTitle = useCallback(
    async (survey_id, question_id, title) => {
      try {
        await axios.put(`${endpoint}/update_question_title/${survey_id}`, {
          question_id: question_id,
          title: title,
        });
        // TODO: put this in helper function to reduce repeating logic
        let copy = [...questions];
        let idx = getQuestionIndex(question_id);
        copy[idx].title = title;
        setQuestions(copy);
      } catch (err) {
        console.error(err.message);
      }
    },
    [getQuestionIndex, questions]
  );

  const updateQuestionType = useCallback(
    async (survey_id, question_id, type) => {
      try {
        const response = await axios.put(
          `${endpoint}/update_question_type/${survey_id}`,
          {
            question_id: question_id,
            type: type,
          }
        );
        let copy = [...questions];
        let idx = getQuestionIndex(question_id);
        copy[idx].type = response.data.type;
        setQuestions(copy);
      } catch (err) {
        console.error(err.message);
      }
    },
    [questions, getQuestionIndex]
  );
  const updateQuestion = useCallback(
    (id, property, value, answerChoiceId) => {
      // id is the question id
      // finds the question
      let copy = [...questions];

      // property or manipulating answer choices
      if (property === "title") {
        updateQuestionTitle(draft.id, id, value);
      } else if (property === "type") {
        updateQuestionType(draft.id, id, value);
        // just in case changing from single or multiselect
        if (value === "emoji_sentiment" || value === "open_ended") {
          removeAnswerChoices(id);
        }
      } else if (property === "answerChoices") {
        if (value === "") {
          // remove exisiting answers
          removeAnswerChoices(id);
        }
        if (value > 5 || value < 0 || value === "") return;

        async function insertChoice() {
          for (let i = 0; i < value; i++) {
            await addAnswerChoice("", i, id);
          }
        }
        insertChoice();
      } else if (property === "addAnswerChoice") {
        if (value !== null && answerChoiceId !== null) {
          // update answer choice call to backend
          updateAnswerChoice(id, answerChoiceId, value);
        }
      } else if (property === "removeAnswerChoice") {
        if (answerChoiceId !== null) {
          removeAnswer(answerChoiceId);
        }
      }
      setQuestions(copy);
    },
    [
      questions,
      draft.id,
      addAnswerChoice,
      removeAnswerChoices,
      updateQuestionTitle,
      updateQuestionType,
      updateAnswerChoice,
      removeAnswer,
    ]
  );
  // publish survey
  const publishSurvey = async () => {
    if (hasDraft) {
      try {
        await axios.put(`${endpoint}/publish_survey/${draft.id}`, {
          number_of_questions: questions.length,
        });

        resetSurveyState();
      } catch (err) {
        console.error(err.message);
      }
    }
    window.location.href = "/surveys";
  };

  const updateSurveyTitle = async (value) => {
    // TODO: regex
    setDraft({...draft, title: value});
    setSurveyTitle(value);
    if (draft.id > 0) {
      // typing before draft started
      try {
        await axios.put(`${endpoint}/update_survey_title/${draft.id}`, {
          title: value,
        });
        setDraft({...draft, title: value});
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  const updateRedirectUrl = async (value) => {
    if (draft.id > 0) {
      if (value === "") {
        setSurveyLink(baseSurveyLink);
        setDraft({...draft, redirect_url: value});
      }
      // can be invalid url just for preview
      if (value.length > 0) {
        let survey_link = baseSurveyLink;
        survey_link = survey_link.concat(`?redirect_url=${value}`);
        setSurveyLink(survey_link);
        setDraft({...draft, redirect_url: value});
      }

      if (validUrl.test(value) || value.length === 0) {
        try {
          await axios.put(`${endpoint}/update_redirect_url/${draft.id}`, {
            redirect_url: value,
          });
          setDraft({...draft, redirect_url: value});
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  };
  const removeSurvey = async () => {
    try {
      await axios.delete(`${endpoint}/delete_survey/${draft.id}`);
    } catch (err) {
      console.error(err.message);
    }
    resetSurveyState();
    window.location.href = "/create";
  };
  const deleteSurvey = async () => {
    if (draft.id > 0) {
      // delete survey first since question_id has foreign_key on survey
      // remove answers then questions for each question
      async function removeQuestions() {
        for (let i = 0; i < questions.length; i++) {
          // removes answers then questions for this survey
          await deleteQuestion(questions[i].id);
        }
      }
      await removeQuestions();

      removeSurvey();
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
      if (surveyTitle === "") {
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
            (answer) => answer.choice.length > 0
          );
          if (!hasAnswers || question.answerChoices.length === 0) {
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
  useEffect(() => {
    if (!surveyStateLoaded) {
      loadSurvey();
    }

    return () => clearTimeout(timerRef.current);
  }, [
    hasDraft,
    surveyTitle,
    draft,
    questions,
    draft.redirect_url,
    errors,
    loadSurvey,
    surveyStateLoaded,
    user.uid,
    questionId,
  ]);
  return (
    <div className="panelContainer">
      <SurveyPreview
        questions={questions}
        surveyTitle={surveyTitle}
        questionId={questionId}
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
            value={surveyTitle}
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
                qId={questionId}
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
                                yes, publish survey
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
                    return (
                      <p style={{fontSize: "17px"}} key={index}>
                        - {err}
                      </p>
                    );
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
                  <button
                    className="Button red"
                    style={{width: "125px"}}
                    id="deleteSurvey"
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
