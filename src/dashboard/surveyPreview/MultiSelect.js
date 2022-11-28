import React, {useState} from "react";

const MultiSelect = ({answerChoices}) => {
  const [selected, setSelected] = useState([]);
  const toggleSelectedChoices = (item) => {
    if (selected.includes(item)) {
      let index = selected.indexOf(item);
      setSelected((prevState) => {
        let copy = [...selected];
        copy.splice(index, 1);
        return copy;
      });
    } else {
      setSelected((current) => [...current, item]);
    }
  };

  return (
    <div className="answerChoicesContainer">
      {answerChoices.map((choice, index) => {
        if (selected.includes(choice)) {
          return (
            <button
              className="answerChoiceButtonSelected"
              name={choice}
              key={index}
              onClick={(e) => toggleSelectedChoices(e.target.name)}
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
              onClick={(e) => toggleSelectedChoices(e.target.name)}
            >
              {choice}
            </button>
          );
        }
      })}
    </div>
  );
};
export default MultiSelect;
