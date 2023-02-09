import React, {useState, useEffect, useRef} from "react";

const MultiSelect = ({answerChoices, index, handleProceed, questionIndex}) => {
  const [selected, setSelected] = useState([]);
  const indexRef = useRef(index);
  const toggleSelectedChoices = (item) => {
    if (selected.includes(item)) {
      let index = selected.indexOf(item);
      setSelected((prevState) => {
        let copy = [...prevState];
        copy.splice(index, 1);
        return copy;
      });
    } else {
      setSelected((current) => [...current, item]);
    }
  };

  useEffect(() => {
    console.log(questionIndex, selected);
    if (index !== indexRef.current) {
      setSelected([]);
    }
    handleProceed(index === indexRef.current && selected.length > 0);
    indexRef.current = index;
  }, [questionIndex, index, selected, handleProceed]);

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
