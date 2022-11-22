import React, {useState, useEffect} from "react";
import {PlusCircledIcon} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import QuestionOverview from "./QuestionOverview";
const QuestionPanel = ({getQuestions, updateQuestion}) => {
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

  useEffect(() => {
    getQuestions(questions); // returns ?'s from questions array to Panel
  }, [questions, getQuestions, updateQuestion]);

  return (
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
  );
};
export default QuestionPanel;
