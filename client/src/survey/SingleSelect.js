import React, {useState, useEffect, useRef, useCallback} from "react";

const SingleSelect = ({
  answerChoices,
  handleProceed,
  index,
  updateResponse,
  surveyId,
}) => {
  // prefill state from localStorage
  const getAnswerIdFromStorage = useCallback(
    (index) => {
      if (localStorage.getItem("bsmr") !== null) {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        let id = surveyId.toString();
        if (Object.keys(bsmr).includes(id)) {
          let res = bsmr[id];
          if (res[index].answers && res[index].answers.length > 0) {
            return res[index].answers[0].answer_id;
          }
        }
      }
      return 0;
    },
    [surveyId]
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
    if (answerId !== answerIdRef.current && answerId !== 0) {
      updateResponse(index, "single_select", [
        {answer_id: answerId, answer: ""},
      ]);
    }
    handleProceed(index === indexRef.current && answerId > 0);
    indexRef.current = index;
    answerIdRef.current = answerId;
  }, [
    answerId,
    index,
    handleProceed,
    surveyId,
    updateResponse,
    getAnswerIdFromStorage,
  ]);
  return (
    <div className="answerChoicesContainer">
      {answerChoices.map((answer, index) => {
        let {choice, id} = answer;
        if (answerId && answerId === id) {
          return (
            <button
              className="answerChoiceButtonSelected"
              name={choice}
              key={index}
              onClick={() => changeSelected(id)}
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
              onClick={() => changeSelected(id)}
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
