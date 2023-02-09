import React, {useState, useEffect, useRef} from "react";

const SingleSelect = ({answerChoices, handleProceed, index}) => {
  const [selected, setSelected] = useState("");
  const indexRef = useRef(index);
  const changeSelected = (item) => {
    setSelected(item);
  };
  useEffect(() => {
    handleProceed(index === indexRef.current && selected.length > 0);
    console.log(`single select: ${selected}`);
    indexRef.current = index;
  }, [selected, index, handleProceed]);
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
