import React, {useState, useRef, useEffect} from "react";
import styled from "styled-components";
export const TextArea = styled.textarea`
  @media (max-width: 430px) {
    width: 90%;
  }
`;
const OpenEnded = ({handleProceed, index, updateResponse, surveyId}) => {
  const [response, setResponse] = useState(() => {
    if (localStorage.getItem("bsmr") !== null) {
      let bsmr = JSON.parse(localStorage.getItem("bsmr"));
      if (Object.keys(bsmr).includes(surveyId)) {
        let res = bsmr[surveyId];
        if (res[index].answerChoices.length > 0) {
          return res[index].answerChoices[0];
        }
      }
    }
    return "";
  });
  const indexRef = useRef(index);
  const responseRef = useRef("");
  const handleChange = (input) => {
    setResponse(input);
  };
  useEffect(() => {
    // resets when next button is click and re-renders component
    if (index !== indexRef.current) {
      setResponse("");
    }
    if (responseRef.current !== response) {
      updateResponse(index, [response], [-1]);
    }
    handleProceed(index === indexRef.current && response.length > 0);
    responseRef.current = response;
    indexRef.current = index;
    // eslint-disable-next-line
  }, [index, handleProceed, response.length, response]);
  return (
    <div>
      <TextArea
        rows="7"
        cols="50"
        className="openEndedTextArea"
        placeholder="Enter your answer..."
        onChange={(e) => handleChange(e.target.value)}
        value={response}
      ></TextArea>
    </div>
  );
};
export default OpenEnded;
