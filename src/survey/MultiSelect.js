import React, {useState, useEffect} from "react";

const MultiSelect = ({answerChoices, index, handleProceed}) => {
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

  useEffect(() => {
    console.log("ms", selected.length !== 0);
    handleProceed(selected.length !== 0);
  }, [index, selected, handleProceed]);

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
