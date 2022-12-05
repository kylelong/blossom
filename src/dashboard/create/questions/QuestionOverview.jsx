import React, {useState, useEffect} from "react";
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

const QuestionOverview = ({
  questions,
  removeQuestion,
  updateQuestion,
  updateQuestionHash,
}) => {
  const [questionType, setQuestionType] = useState("");
  const [questionHash, setQuestionHash] = useState("");
  const [numberOfAnswers, setNumberOfAnswers] = useState(0);
  const updateQuestionType = (type) => {
    setQuestionType(type);
    // TODO: hash is blank if not set on onChange
    updateQuestion(questionHash, "questionType", type, null);
  };
  const hasOptions = ["single_select", "multi_select"].includes(questionType);
  const questionDetails = {
    single_select: "select one option (at most 5 choices)",
    multi_select: "select all that apply (at most 5 choices)",
    emoji_sentiment: "range of emojis to gauage interest level",
    open_ended: "input box for text responses",
  };

  const questionTypeInfo = (questionType) => {
    if (questionType.length > 0) {
      switch (questionType) {
        case "single_select":
          return questionDetails.single_select;
        case "multi_select":
          return questionDetails.multi_select;
        case "emoji_sentiment":
          return questionDetails.emoji_sentiment;
        case "open_ended":
          return questionDetails.open_ended;
        default:
          return "";
      }
    }
  };

  useEffect(() => {
    //let index = questions.findIndex((element) => element.hash === questionHash);
    //setNumberOfAnswers(questions[index].numberOfAnswers);
    if (
      (questionHash === "" && questions.length === 1) ||
      (questionHash.length > 0 && questions.length === 1)
    ) {
      setQuestionHash(questions[0].hash);
    }
  }, [questions, questionHash, numberOfAnswers, questionType]);
  return (
    <>
      {questions.map((question, index) => {
        let label = `Question ${index + 1}`; //question 1 - 4twerg9
        return (
          <div
            key={index}
            onClick={() => {
              setQuestionHash(question.hash);
              updateQuestionHash(question.hash);
            }}
          >
            <Accordion.Item
              className="AccordionItem"
              value={`item-${index + 1}`}
            >
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
                      e.target.value,
                      null
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
                    {hasOptions && (
                      <input
                        type="text"
                        maxLength="1"
                        className="answerChoices"
                        placeholder="# of answers"
                        onChange={(e) => {
                          let num = e.target.value;
                          setNumberOfAnswers(num);
                          updateQuestion(
                            question.hash,
                            "numberOfAnswerChoices",
                            num,
                            null
                          );
                          updateQuestion(
                            question.hash,
                            "answerChoices",
                            num,
                            null
                          );
                        }}
                      ></input>
                    )}
                  </div>

                  {questionType.length > 0 && (
                    <div className="questionTypeInfo">
                      {questionTypeInfo(question.questionType)}
                    </div>
                  )}

                  {hasOptions && numberOfAnswers >= 0 && (
                    <div className="MultipleChoiceInputContainer">
                      <MultipleChoiceInput
                        amount={question.numberOfAnswerChoices}
                        updateQuestion={updateQuestion}
                        questionHash={question.hash}
                        questions={questions}
                      />
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
