import React, {useState} from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import {CheckIcon, ChevronDownIcon, ChevronUpIcon} from "@radix-ui/react-icons";
import "./questiontypeselect.css";

const QuestionTypeSelectMenu = ({updateQuestionType, defaultQuestionType}) => {
  const [choice, setChoice] = useState(defaultQuestionType);
  const validQuestionTypes = [
    "single_select",
    "multi_select",
    "emoji_sentiment",
    "open_ended",
    "short_answer",
    "number",
  ];
  // use value={choice}
  return (
    <Select.Root
      onValueChange={(value) => {
        if (validQuestionTypes.includes(value)) {
          setChoice(value);
          updateQuestionType(value);
        }
      }}
    >
      <Select.Trigger className="SelectTrigger" aria-label="question type">
        <Select.Value
          placeholder={choice && choice.length > 0 ? choice : "question type"}
        />
        <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>{" "}
      <Select.Portal>
        <Select.Content className="SelectContent">
          <Select.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="SelectViewport">
            <Select.Group>
              <Select.Label className="SelectLabel">question type</Select.Label>
              <SelectItem value="single_select">single select</SelectItem>
              <SelectItem value="multi_select">multi-select</SelectItem>
              <SelectItem value="emoji_sentiment">emoji sentiment</SelectItem>
              <SelectItem value="short_answer">short answer</SelectItem>
              <SelectItem value="open_ended">open ended</SelectItem>
              <SelectItem value="number">number</SelectItem>
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = React.forwardRef(
  ({children, className, ...props}, forwardedRef) => {
    return (
      <Select.Item
        className={classnames("SelectItem", className)}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

export default QuestionTypeSelectMenu;
