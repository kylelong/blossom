import React, {useState, useEffect, useRef} from "react";

const SingleSelect = ({
  answerChoices,
  handleProceed,
  index,
  updateResponse,
}) => {
  const [selected, setSelected] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const indexRef = useRef(index); // question index
  const selectedRef = useRef(selected);
  const selectedIndexRef = useRef(selectedIndex);
  const changeSelected = (item, index) => {
    setSelected(item);
    setSelectedIndex(index);
  };
  useEffect(() => {
    if (index !== indexRef.current) {
      setSelected([]);
      setSelectedIndex([]);
    }
    if (
      selected !== selectedRef.current ||
      selectedIndex !== selectedIndexRef.current
    ) {
      updateResponse(index, [selected], [selectedIndex]);
    }
    handleProceed(index === indexRef.current && selected.length > 0);
    indexRef.current = index;
    selectedRef.current = selected;
    selectedIndexRef.current = selectedIndex;
  }, [selected, index, handleProceed, selectedIndex]);
  return (
    <div className="answerChoicesContainer">
      {answerChoices.map((choice, index) => {
        if (choice && selected === choice) {
          return (
            <button
              className="answerChoiceButtonSelected"
              name={choice}
              key={index}
              onClick={(e) => changeSelected(e.target.name, index)}
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
              onClick={(e) => changeSelected(e.target.name, index)}
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
