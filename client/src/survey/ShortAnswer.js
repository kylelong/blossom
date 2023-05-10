import React, {useState, useRef, useEffect, useCallback} from "react";
import styled from "styled-components";
export const Input = styled.input`
  margin-top: 32px;
  width: 275px;
  height: 38px;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 400;
  border: 1.5px solid #c4c4c4;
  border-radius: 3px;
  padding-left: 5px;
`;
const ShortAnswer = ({handleProceed, index, updateResponse, surveyHash}) => {
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
      updateResponse(index, "short_answer", [
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
      <Input
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter your answer..."
        value={response}
      />
    </div>
  );
};
export default ShortAnswer;
