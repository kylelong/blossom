import React, {useState} from "react";

const QuestionTitle = ({question, updateQuestion}) => {
  const [title, setTitle] = useState(question.title);
  return (
    <>
      <input
        type="text"
        className="questionTitle"
        placeholder="question title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          updateQuestion(question.id, "title", e.target.value, null);
        }}
      ></input>
    </>
  );
};
export default QuestionTitle;
