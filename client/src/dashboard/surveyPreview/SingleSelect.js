import React, {useState, useEffect} from "react";

const SingleSelect = ({answerChoices}) => {
  const [selected, setSelected] = useState("");
  const changeSelected = (item) => {
    setSelected(item);
  };
  useEffect(() => {}, [answerChoices]);

  return (
    <div className="answerChoicesContainer">
      {answerChoices &&
        answerChoices.map((answer) => {
          const {choice, id} = answer;
          if (choice && selected === choice) {
            return (
              <button
                className="answerChoiceButtonSelected"
                name={choice}
                key={id}
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
                key={id}
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
