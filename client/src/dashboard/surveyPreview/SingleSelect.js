import React, {useState} from "react";

const SingleSelect = ({answerChoices}) => {
  const [selected, setSelected] = useState("");
  const changeSelected = (item) => {
    setSelected(item);
  };
  return (
    <div className="answerChoicesContainer">
      {answerChoices &&
        answerChoices.map((answer, index) => {
          const {choice, id} = answer;
          if (choice && selected === choice) {
            return (
              <button
                className="answerChoiceButtonSelected"
                name={choice}
                key={index}
                onClick={(e) => changeSelected(e.target.name)}
              >
                {choice}
              </button>
            );
          } else {
            return (
              <button
                className="answerChoiceButton"
                name={choice}
                key={index}
                onClick={(e) => changeSelected(e.target.name)}
              >
                {choice}
              </button>
            );
          }
        })}
    </div>
  );
};
export default SingleSelect;
