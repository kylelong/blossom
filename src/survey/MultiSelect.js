import React, {useState, useEffect, useRef} from "react";

const MultiSelect = ({
  answerChoices,
  index,
  handleProceed,
  questionIndex,
  updateResponse,
}) => {
  const [selected, setSelected] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const indexRef = useRef(index);
  const selectedRef = useRef(selected);
  const selectedIndicesRef = useRef(selectedIndices);
  const toggleSelectedChoices = (item, index) => {
    if (selected.includes(item)) {
      let idx = selected.indexOf(item);
      setSelected((prevState) => {
        let copy = [...prevState];
        copy.splice(idx, 1);
        return copy;
      });
    } else {
      setSelected((current) => [...current, item]);
    }

    // handle indices
    if (selectedIndices.includes(index)) {
      let idx = selectedIndices.indexOf(index);
      setSelectedIndices((prevState) => {
        let copy = [...prevState];
        copy.splice(idx, 1);
        return copy;
      });
    } else {
      setSelectedIndices((current) => [...current, index]);
    }
  };

  useEffect(() => {
    // console.log(`questionIndex ${questionIndex}: `, selected, selectedIndices); //TODO: remove
    if (index !== indexRef.current) {
      setSelected([]);
      setSelectedIndices([]);
    }
    if (
      selected !== selectedRef.current ||
      selectedIndices !== selectedIndicesRef.current
    ) {
      updateResponse(questionIndex, selected, selectedIndices);
    }
    handleProceed(index === indexRef.current && selected.length > 0);
    indexRef.current = index;
    selectedRef.current = selected;
    selectedIndicesRef.current = selectedIndices;
  }, [questionIndex, index, selected, handleProceed, selectedIndices]);

  return (
    <div className="answerChoicesContainer">
      {answerChoices.map((choice, index) => {
        if (selected.includes(choice)) {
          return (
            <button
              className="answerChoiceButtonSelected"
              name={choice}
              key={index}
              onClick={(e) => toggleSelectedChoices(e.target.name, index)}
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
              onClick={(e) => toggleSelectedChoices(e.target.name, index)}
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
