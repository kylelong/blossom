import React, {useState, useEffect, useRef} from "react";

const SingleSelect = ({
  answerChoices,
  handleProceed,
  index,
  updateResponse,
  surveyId,
}) => {
  // prefill state from localStorage
  const [answerId, setAnswerId] = useState(() => {
    if (localStorage.getItem("bsmr") !== null) {
      let bsmr = JSON.parse(localStorage.getItem("bsmr"));
      let id = surveyId.toString();
      if (Object.keys(bsmr).includes(id)) {
        let res = bsmr[id];
        if (res[index].answers && res[index].answers.length > 0) {
          return res[index].answers.answer_id;
        }
      }
    }
    return [];
  });

  const indexRef = useRef(index); // question index
  const answerIdRef = useRef(answerId);
  const changeSelected = (id) => {
    setAnswerId(id);
  };

  useEffect(() => {
    if (index !== indexRef.current) {
      setAnswerId(-1);
    }
    if (answerId !== answerIdRef.current) {
      updateResponse(index, "single_select", [
        {answer_id: answerId, answer: ""},
      ]);
    }
    handleProceed(index === indexRef.current && answerId > -1);
    indexRef.current = index;
    answerIdRef.current = answerId;
  }, [answerId, index, handleProceed, surveyId, updateResponse]);
  return (
    <div className="answerChoicesContainer">
      {answerChoices.map((answer, index) => {
        let {choice, id} = answer;
        if (answerId === id) {
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
