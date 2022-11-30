import React, {useState, useEffect, useCallback} from "react";
import {useForm} from "react-hook-form";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Label from "@radix-ui/react-label";
import {PlusCircledIcon} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import QuestionOverview from "./questions/QuestionOverview";
import SurveyPreveiw from "../surveyPreview/SurveyPreview";
import "./panel.css";

const Panel = () => {
  const {register, handleSubmit} = useForm();
  const [data, setData] = useState("Survey Title");
  const [surveyName, setSurveyName] = useState("Survey Title");
  const [questions, setQuestions] = useState([]);
  const [questionHash, setQuestionHash] = useState("");

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

  const publishSurvey = () => {
    console.log("publishing surey");
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
  };

  useEffect(() => {
    if (surveyName.length === 0) {
      setSurveyName("Survey Title");
    }
    // console.log(JSON.stringify(questions, null, 2));
  }, [surveyName, questions]);

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
          <Label.Root className="LabelRoot" htmlFor="surveyTitle">
            Survey Title:
          </Label.Root>
          <input
            {...register("surveyTitle")}
            onChange={(e) => setSurveyName(e.target.value)}
            className="Input"
            type="text"
            name="surveyTitle"
            id="surveyTitle"
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
                    <button className="publishBtn panelBtn" type="submit">
                      Publish
                    </button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Portal>
                    <AlertDialog.Overlay className="AlertDialogOverlay" />
                    <AlertDialog.Content className="AlertDialogContent">
                      <AlertDialog.Title className="AlertDialogTitle">
                        Are you absolutely sure?
                      </AlertDialog.Title>
                      <AlertDialog.Description className="AlertDialogDescription">
                        Once you publish this survey you won't be able to edit
                        it. Delete this survey to begin a new one, otherwise it
                        is saved as a draft until published.
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
                </AlertDialog.Root>
              </>
            )}
          </div>
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
