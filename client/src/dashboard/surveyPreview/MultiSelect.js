import React, {useState, useEffect} from "react";

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

  useEffect(() => {}, [answerChoices]);

  return (
    <div className="answerChoicesContainer">
      {answerChoices.map((answer) => {
        const {choice, id} = answer;
        if (selected.includes(choice)) {
          return (
            <button
              className="answerChoiceButtonSelected"
              name={choice}
              key={id}
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
              key={id}
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
