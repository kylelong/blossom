import React, {useState, useEffect} from "react";

const SingleSelect = ({answerChoices}) => {
  const [selected, setSelected] = useState("");
  const changeSelected = (item) => {
    setSelected(item);
  };
  useEffect(() => {
    // console.log(selected);
  }, [selected]);
  return (
    <div className="answerChoicesContainer">
      {answerChoices.map((choice, index) => {
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
