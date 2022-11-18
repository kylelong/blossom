import React, {useState, useEffect} from "react";
import {
  ChevronDownIcon,
  PlusCircledIcon,
  MinusCircledIcon,
} from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "classnames";
const QuestionPanel = ({label, index}) => {
  const [questions, setQuestions] = useState([]);
  const addQuestion = () => {
    const index = questions.length;
    let label = `Question ${index + 1}`;
    setQuestions((questions) => [...questions, QuestionItem(label, index)]);
  };
  // update index
  const removeQuestion = (index) => {
    console.log(index);
    setQuestions((questions) => [
      ...questions.slice(0, index),
      ...questions.slice(index + 1),
    ]);
  };

  const QuestionItem = (label, index) => {
    return (
      <Accordion.Item className="AccordionItem" value={`item-${index}`}>
        <AccordionTrigger>{label}</AccordionTrigger>
        <AccordionContent>
          <div>{label}</div>
          <button
            className="removeQuestionBtn panelBtn"
            onClick={() => removeQuestion(index)}
          >
            Remove
            <MinusCircledIcon style={{marginLeft: "5px"}} />
          </button>
        </AccordionContent>
      </Accordion.Item>
    );
  };

  const AccordionTrigger = React.forwardRef(
    ({children, className, ...props}, forwardedRef) => (
      <Accordion.Header className="AccordionHeader">
        <Accordion.Trigger
          className={classNames("AccordionTrigger", className)}
          {...props}
          ref={forwardedRef}
        >
          {children}
          <ChevronDownIcon className="AccordionChevron" aria-hidden />
        </Accordion.Trigger>
      </Accordion.Header>
    )
  );

  const AccordionContent = React.forwardRef(
    ({children, className, ...props}, forwardedRef) => (
      <Accordion.Content
        className={classNames("AccordionContent", className)}
        {...props}
        ref={forwardedRef}
      >
        <div className="AccordionContentText">{children}</div>
      </Accordion.Content>
    )
  );

  return (
    <div className="QuestionPanel">
      <Accordion.Root
        className="AccordionRoot"
        type="single"
        defaultValue="item-1"
        collapsible
      >
        {questions.map((question, index) => {
          return <React.Fragment key={index}>{question}</React.Fragment>;
        })}
      </Accordion.Root>
      <button className="addQuestionBtn panelBtn" onClick={addQuestion}>
        Add Question <PlusCircledIcon style={{marginLeft: "5px"}} />
      </button>
    </div>
  );
};
export default QuestionPanel;
