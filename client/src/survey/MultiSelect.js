import React, {useState, useEffect, useRef, useCallback} from "react";

const MultiSelect = ({
  answerChoices,
  index,
  handleProceed,
  questionIndex,
  updateResponse,
  surveyId,
}) => {
  const getAnswersFromStorage = useCallback(
    (index) => {
      if (localStorage.getItem("bsmr") !== null) {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        let id = surveyId.toString();
        if (Object.keys(bsmr).includes(id)) {
          let res = bsmr[id];
          if (res[index].answers && res[index].answers.length > 0) {
            return res[index].answers;
          }
        }
      }
      return [];
    },
    [surveyId]
  );
  // prefill state from localStorage
  const [selected, setSelected] = useState(
    getAnswersFromStorage(questionIndex)
  );

  const indexRef = useRef(index);
  const selectedRef = useRef(selected);
  const toggleSelectedChoices = (id) => {
    let idx = selected.findIndex((el) => el.answer_id === id);
    if (idx >= 0) {
      setSelected((prevState) => {
        let copy = [...prevState];
        copy.splice(idx, 1);
        return copy;
      });
    } else {
      if (idx === -1) {
        // do not add duplicates
        setSelected((current) => [...current, {answer_id: id, answer: ""}]);
      }
    }
  };

  useEffect(() => {
    if (index !== indexRef.current) {
      setSelected(getAnswersFromStorage(questionIndex));
    }
    if (selected !== selectedRef.current) {
      updateResponse(questionIndex, "multi_select", selected);
    }
    handleProceed(index === indexRef.current && selected.length > 0);
    indexRef.current = index;
    selectedRef.current = selected;
  }, [
    questionIndex,
    index,
    selected,
    handleProceed,
    getAnswersFromStorage,
    updateResponse,
  ]);

  return (
    <div className="answerChoicesContainer">
      {answerChoices.map((answer) => {
        let {choice, id} = answer;
        let found = selected.find((el) => el.answer_id === id);
        if (found) {
          return (
            <button
              className="answerChoiceButtonSelected"
              name={choice}
              key={id}
              onClick={() => toggleSelectedChoices(id)}
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
              onClick={() => toggleSelectedChoices(id)}
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
