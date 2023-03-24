import React, {useState, useEffect, useRef, useCallback} from "react";

const SingleSelect = ({
  answerChoices,
  handleProceed,
  index,
  updateResponse,
  surveyHash,
}) => {
  // prefill state from localStorage
  const getAnswerIdFromStorage = useCallback(
    (index) => {
      if (localStorage.getItem("bsmr") !== null) {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        if (Object.keys(bsmr).includes(surveyHash)) {
          let res = bsmr[surveyHash];
          if (res[index].answers && res[index].answers.length > 0) {
            return res[index].answers[0].answer_hash;
          }
        }
      }
      return "";
    },
    [surveyHash]
  );
  const [answerId, setAnswerId] = useState(getAnswerIdFromStorage(index));

  const indexRef = useRef(index); // question index
  const answerIdRef = useRef(answerId);
  const changeSelected = (id) => {
    setAnswerId(id);
  };

  useEffect(() => {
    if (index !== indexRef.current) {
      setAnswerId(getAnswerIdFromStorage(index));
    }
    if (answerId !== answerIdRef.current && answerId !== "") {
      updateResponse(index, "single_select", [
        {answer_hash: answerId, answer: ""},
      ]);
    }
    handleProceed(index === indexRef.current && answerId.length > 0);
    indexRef.current = index;
    answerIdRef.current = answerId;
  }, [
    answerId,
    index,
    handleProceed,
    surveyHash,
    updateResponse,
    getAnswerIdFromStorage,
  ]);
  return (
    <div className="answerChoicesContainer">
      {answerChoices &&
        answerChoices.map((answer, index) => {
          let {choice, hash} = answer;
          if (answerId && answerId === hash) {
            return (
              <button
                className="answerChoiceButtonSelected"
                name={choice}
                key={index}
                onClick={() => changeSelected(hash)}
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
                onClick={() => changeSelected(hash)}
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
