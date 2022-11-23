import React, {useEffect, useState} from "react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Label from "@radix-ui/react-label";
import {ChevronDownIcon, MinusCircledIcon} from "@radix-ui/react-icons";
import classNames from "classnames";
import QuestionTypeSelectMenu from "./QuestionTypeSelectMenu";
import MultipleChoiceInput from "./MultipleChoiceInput";
import "./questionoverview.css";
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
  const [questionType, setQuestionType] = useState("");
  const [questionHash, setQuestionHash] = useState("");
  const [numberOfAnswers, setNumberOfAnswers] = useState(0);
  const updateQuestionType = (type) => {
    setQuestionType(type);
    updateQuestion(questionHash, "questionType", type);
  };
  const hasOptions = ["single_select", "multi_select"].includes(questionType);
  useEffect(() => {
    console.log(questionType);
    //let index = questions.findIndex((element) => element.hash === questionHash);
    //                                                                                                                                                                                             setNumberOfAnswers(questions[index].numberOfAnswers);
  }, [questionHash, numberOfAnswers, questionType]);
  return (
    <>
      {questions.map((question, index) => {
        let label = `Question ${index + 1}`; //question 1 - 4twerg9
        return (
          <div key={index} onClick={() => setQuestionHash(question.hash)}>
            <Accordion.Item className="AccordionItem" value={`item-${index}`}>
              <AccordionTrigger>{label}</AccordionTrigger>
              <AccordionContent>
                <Label.Root className="LabelRoot" htmlFor="surveyTitle">
                  Title:
                </Label.Root>
                <input
                  type="text"
                  className="questionTitle"
                  placeholder="Question title"
                  value={question.questionTitle ? question.questionTitle : ""}
                  onChange={(e) => {
                    updateQuestion(
                      question.hash,
                      "questionTitle",
                      e.target.value
                    );
                  }}
                ></input>
                <div className="questionDetailsContainer">
                  <div className="questionTypeContainer">
                    <QuestionTypeSelectMenu
                      updateQuestionType={updateQuestionType}
                      defaultQuestionType={question.questionType}
                      hash={question.hash}
                    />
                    {/* <Label.Root className="LabelRoot" htmlFor="surveyTitle">
                      # of answer choices:
                    </Label.Root> */}
                    {hasOptions && (
                      <input
                        type="text"
                        className="answerChoices"
                        placeholder="# of answers"
                        onChange={(e) => {
                          let num = e.target.value;
                          setNumberOfAnswers(num);
                          updateQuestion(
                            question.hash,
                            "numberOfAnswerChoices",
                            num
                          );
                        }}
                      ></input>
                    )}
                  </div>
                  {hasOptions && numberOfAnswers > 0 && (
                    <div className="MultipleChoiceInputContainer">
                      <MultipleChoiceInput amount={numberOfAnswers} />
                    </div>
                  )}

                  <button
                    className="removeQuestionBtn panelBtn"
                    onClick={() => removeQuestion(index)}
                  >
                    Remove
                    <MinusCircledIcon style={{marginLeft: "5px"}} />
                  </button>
                </div>
              </AccordionContent>
            </Accordion.Item>
          </div>
        );
      })}
    </>
  );
};

export default QuestionOverview;
