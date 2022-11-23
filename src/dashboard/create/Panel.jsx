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
    (hash, property, value) => {
      let copy = [...questions];
      let index = copy.findIndex((element) => element.hash === hash);
      if (property in questions[index]) {
        if (property === "questionTitle") {
          copy[index].questionTitle = value;
        } else if (property === "questionType") {
          copy[index].questionType = value;
        } else if (property === "numberOfAnswerChoices") {
          copy[index].numberOfAnswerChoices = value;
        }
        setQuestions(copy);
      }
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
              {question.hash} - {question.questionTitle} -{" "}
              {question.questionType}
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
