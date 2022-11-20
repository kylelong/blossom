import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {ChevronDownIcon, MinusCircledIcon} from "@radix-ui/react-icons";
import classNames from "classnames";
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

const QuestionOverview = ({questions, removeQuestion, updateQuestion}) => {
  return (
    <>
      {questions.map((question, index) => {
        let label = `Question ${index + 1} - ${question.hash}`; //question 1 - 4twerg9
        return (
          <React.Fragment key={index}>
            <Accordion.Item className="AccordionItem" value={`item-${index}`}>
              <AccordionTrigger>{label}</AccordionTrigger>
              <AccordionContent>
                <div>{label}</div>
                <input
                  type="text"
                  placeholder="question title"
                  onChange={(e) => {
                    updateQuestion(question.hash, e.target.value);
                    // console.log(
                    //   `updating question with hash ${question.hash} question title to be`,
                    //   e.target.value
                    // );
                  }}
                ></input>
                <button
                  className="removeQuestionBtn panelBtn"
                  onClick={() => removeQuestion(index)}
                >
                  Remove
                  <MinusCircledIcon style={{marginLeft: "5px"}} />
                </button>
              </AccordionContent>
            </Accordion.Item>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default QuestionOverview;
