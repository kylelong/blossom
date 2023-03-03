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
  updateQuestionId,
}) => {
  const [questionType, setQuestionType] = useState("");
  const [questionId, setQuestionId] = useState(0);
  const [numberOfAnswers, setNumberOfAnswers] = useState(0); // for the question i am currently selecting
  const updateQuestionType = (type) => {
    setQuestionType(type);
    updateQuestion(questionId, "type", type, null);
  };
  const hasOptions = ["single_select", "multi_select"].includes(questionType);

  const questionDetails = {
    single_select: "select one option (at most 5 choices)",
    multi_select: "select all that apply (at most 5 choices)",
    emoji_sentiment: "range of emojis to gauage interest level",
    open_ended: "input box for text responses",
  };

  // snippet below all question options (title, type, and # of answers selector)
  const questionTypeInfo = (questionType) => {
    if (questionType && questionType.length > 0) {
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

  useEffect(() => {}, [questions, questionId, questionType]);
  return (
    <>
      {questions.map((question, index) => {
        let label = `question ${index + 1}`;
        return (
          <div
            key={index}
            onClick={() => {
              setQuestionType(questions[index].type);
              setQuestionId(question.id);
              updateQuestionId(question.id);
            }}
          >
            <Accordion.Item
              className="AccordionItem"
              value={`item-${index + 1}`}
            >
              <AccordionTrigger>{label}</AccordionTrigger>
              <AccordionContent>
                <Label.Root className="LabelRoot" htmlFor="surveyTitle">
                  title:
                </Label.Root>
                <input
                  type="text"
                  className="questionTitle"
                  placeholder="question title"
                  value={question.title ? question.title : ""}
                  onChange={(e) => {
                    updateQuestion(question.id, "title", e.target.value, null);
                  }}
                ></input>
                <div className="questionDetailsContainer">
                  <div className="questionTypeContainer">
                    <QuestionTypeSelectMenu
                      updateQuestionType={updateQuestionType}
                      defaultQuestionType={question.type}
                    />
                    {hasOptions && (
                      <input
                        type="text"
                        maxLength="1"
                        className="answerChoices"
                        placeholder="# of answers"
                        // value={
                        //   question.numberOfAnswerChoices > 0
                        //     ? question.numberOfAnswerChoices
                        //     : ""
                        // }
                        onChange={(e) => {
                          let num = e.target.value;
                          setNumberOfAnswers(num);
                          updateQuestion(
                            question.id,
                            "numberOfAnswerChoices",
                            num,
                            null
                          );
                          updateQuestion(
                            question.id,
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
                        questionId={question.id}
                        questions={questions}
                      />
                    </div>
                  )}

                  <button
                    className="removeQuestionBtn panelBtn"
                    onClick={(e) => {
                      e.preventDefault();
                      const {id, index} = question;

                      removeQuestion(id, index);
                    }}
                  >
                    remove
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
