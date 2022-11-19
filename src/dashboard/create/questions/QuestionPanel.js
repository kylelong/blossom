import React, {useState, useEffect} from "react";
import {PlusCircledIcon} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import QuestionOverview from "./QuestionOverview";
const QuestionPanel = () => {
  const [questions, setQuestions] = useState([]);
  const addQuestion = () => {
    setQuestions((questions) => [...questions, randomHash()]);
  };
  const randomHash = () => {
    return Math.random().toString(36).substr(2, 10);
  };
  useEffect(() => {}, [questions]);
  // update index
  const removeQuestion = (index) => {
    setQuestions((prevState) => {
      const questions = [...prevState];
      questions.splice(index, 1);
      return questions;
    });
  };

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
        />
      </Accordion.Root>
      <button className="addQuestionBtn panelBtn" onClick={addQuestion}>
        Add Question <PlusCircledIcon style={{marginLeft: "5px"}} />
      </button>
    </div>
  );
};
export default QuestionPanel;
