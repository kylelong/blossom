import React, {useState, useEffect, useCallback} from "react";
import {useForm} from "react-hook-form";
import * as Label from "@radix-ui/react-label";
import {PlusCircledIcon} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import QuestionOverview from "./questions/QuestionOverview";
import "./panel.css";

const Panel = () => {
  const {register, handleSubmit} = useForm();
  const [data, setData] = useState("Survey Title");
  const [surveyName, setSurveyName] = useState("Survey Title");
  const [questions, setQuestions] = useState([]);

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
        copy[index].numberOfAnswerChoices = value;
      } else if (property === "answerChoices") {
        let choices = [];
        for (let i = 0; i < value; i++) {
          choices.push("");
        }
        copy[index].answerChoices = choices;
      } else if (property === "addAnswerChoice") {
        if (value !== null && answerChoiceIndex !== null) {
          let answerChoicesCopy = copy[index].answerChoices;
          answerChoicesCopy[answerChoiceIndex] = value;
          copy[index].answerChoices = answerChoicesCopy;
        }
      } else if (property === "removeAnswerChoice") {
        if (answerChoiceIndex !== null) {
          console.log("deleting index", answerChoiceIndex);
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

  useEffect(() => {
    if (surveyName.length === 0) {
      setSurveyName("Survey Title");
    }
    console.log(JSON.stringify(questions, null, 2));
  }, [surveyName, questions]);

  return (
    <div className="panelContainer">
      <div className="surveyContainer">
        <div className="surveyName">{surveyName}</div>
        {questions.map((question, index) => {
          return (
            <div key={index}>
              {question.hash} - {question.questionTitle} -
              {question.numberOfAnswerChoices} - {question.questionType}
            </div>
          );
        })}
      </div>
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
              defaultValue="item-1"
              collapsible
            >
              <QuestionOverview
                questions={questions}
                removeQuestion={removeQuestion}
                updateQuestion={updateQuestion}
              />
            </Accordion.Root>
            <button
              className="addQuestionBtn panelBtn"
              onClick={(e) => {
                addQuestion();
                e.preventDefault();
              }}
            >
              Add Question <PlusCircledIcon style={{marginLeft: "5px"}} />
            </button>
          </div>
          <button className="publishBtn panelBtn" type="submit">
            Publish
          </button>
        </form>
      </div>
    </div>
  );
};
export default Panel;
