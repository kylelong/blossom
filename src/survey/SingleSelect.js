import React, {useState, useEffect, useRef} from "react";

const SingleSelect = ({
  answerChoices,
  handleProceed,
  index,
  updateResponse,
  surveyId,
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
    // if (index == 0 && selected.length === 0) {
    //   if (localStorage.getItem("bsmr") !== null) {
    //     let bsmr = JSON.parse(localStorage.getItem("bsmr"));
    //     if (Object.keys(bsmr).includes(surveyId)) {
    //       let res = bsmr[surveyId];
    //       setSelected(res[index].answerChoices);
    //       console.log(res[index].answerChoices);
    //       setSelectedIndex(res[index].answerIndices);
    //     }
    //   }
    // }
    if (index !== indexRef.current) {
      if (localStorage.getItem("bsmr") !== null) {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        if (Object.keys(bsmr).includes(surveyId)) {
          let res = bsmr[surveyId];
          setSelected(res[index].answerChoices);
          setSelectedIndex(res[index].answerIndices);
        }
      } else {
        setSelected([]);
        setSelectedIndex([]);
      }
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
