import React, {useState, useEffect, useRef} from "react";

const SingleSelect = ({
  answerChoices,
  handleProceed,
  index,
  updateResponse,
  surveyId,
}) => {
  // prefill state from localStorage
  const [selected, setSelected] = useState(() => {
    if (localStorage.getItem("bsmr") !== null) {
      let bsmr = JSON.parse(localStorage.getItem("bsmr"));
      if (Object.keys(bsmr).includes(surveyId)) {
        let res = bsmr[surveyId];
        if (res[index].answerChoices.length > 0) {
          return res[index].answerChoices[0];
        }
      }
    }
    return [];
  });
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (localStorage.getItem("bsmr") !== null) {
      let bsmr = JSON.parse(localStorage.getItem("bsmr"));
      if (Object.keys(bsmr).includes(surveyId)) {
        let res = bsmr[surveyId];
        if (res[index].answerIndices.length > 0) {
          return res[index].answerIndices[0];
        }
      }
    }
    return 0;
  });
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
    // eslint-disable-next-line
  }, [selected, index, handleProceed, selectedIndex, surveyId]);
  return (
    <div className="answerChoicesContainer">
      {answerChoices.map((answer, index) => {
        let {choice, id} = answer;
        if (choice && selected === choice) {
          return (
            <button
              className="answerChoiceButtonSelected"
              name={choice}
              key={id}
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
              key={id}
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
