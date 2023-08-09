import React, {useState, useRef, useEffect, useCallback} from "react";
import styled from "styled-components";

export const NumberInput = styled.input`
  position: relative;
  top: 50px;
`;
const Number = ({handleProceed, index, updateResponse, surveyHash}) => {
  const getAnswerFromStorage = useCallback(
    (index) => {
      if (localStorage.getItem("bsmr") !== null) {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        if (Object.keys(bsmr).includes(surveyHash)) {
          let res = bsmr[surveyHash];
          if (res[index].answers && res[index].answers.length > 0) {
            return res[index].answers[0].answer;
          }
        }
      }
      return "";
    },
    [surveyHash]
  );
  const [response, setResponse] = useState(getAnswerFromStorage(index));
  const indexRef = useRef(index);
  const responseRef = useRef("");
  const handleChange = (input) => {
    setResponse(input);
  };
  useEffect(() => {
    // resets when next button is click and re-renders component
    if (index !== indexRef.current) {
      setResponse(getAnswerFromStorage(index));
    }
    if (responseRef.current !== response) {
      updateResponse(index, "number", [
        {
          hash: "",
          answer: response,
        },
      ]);
    }
    handleProceed(index === indexRef.current && response.length > 0);
    responseRef.current = response;
    indexRef.current = index;
    // eslint-disable-next-line
  }, [index, handleProceed, response.length, response]);
  return (
    <div>
      <NumberInput
        type="number"
        onChange={(e) => handleChange(e.target.value)}
        value={response}
      />
    </div>
  );
};

export default Number;
