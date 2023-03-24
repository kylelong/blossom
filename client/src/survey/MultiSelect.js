import React, {useState, useEffect, useRef, useCallback} from "react";

const MultiSelect = ({
  answerChoices,
  index,
  handleProceed,
  questionIndex,
  updateResponse,
  surveyHash,
}) => {
  const getAnswersFromStorage = useCallback(
    (index) => {
      if (localStorage.getItem("bsmr") !== null) {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        if (Object.keys(bsmr).includes(surveyHash)) {
          let res = bsmr[surveyHash];
          if (res[index].answers && res[index].answers.length > 0) {
            return res[index].answers;
          }
        }
      }
      return [];
    },
    [surveyHash]
  );
  // prefill state from localStorage
  const [selected, setSelected] = useState(
    getAnswersFromStorage(questionIndex)
  );

  const indexRef = useRef(index);
  const selectedRef = useRef(selected);
  const toggleSelectedChoices = (hash) => {
    let idx = selected.findIndex((el) => el.hash === hash);
    if (idx >= 0) {
      setSelected((prevState) => {
        let copy = [...prevState];
        copy.splice(idx, 1);
        return copy;
      });
    } else {
      if (idx === -1) {
        // do not add duplicates
        setSelected((current) => [...current, {answer_hash: hash, answer: ""}]);
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
      {answerChoices &&
        answerChoices.map((answer) => {
          let {choice, hash} = answer;
          let found = selected.find((el) => el.hash === hash);
          if (found) {
            return (
              <button
                className="answerChoiceButtonSelected"
                name={choice}
                key={hash}
                onClick={() => toggleSelectedChoices(hash)}
              >
                {choice}
              </button>
            );
          } else {
            return (
              <button
                className="answerChoiceButton"
                name={choice}
                key={hash}
                onClick={() => toggleSelectedChoices(hash)}
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
