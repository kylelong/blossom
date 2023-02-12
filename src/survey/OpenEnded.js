import React, {useState, useRef, useEffect} from "react";
const OpenEnded = ({handleProceed, index, updateResponse}) => {
  const [response, setResponse] = useState("");
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
    handleProceed(index === indexRef.current || response.length > 0);
    responseRef.current = response;
    indexRef.current = index;
  }, [index, handleProceed, response.length, response]);
  return (
    <div>
      <textarea
        rows="7"
        cols="50"
        className="openEndedTextArea"
        placeholder="Enter your answer..."
        onChange={(e) => handleChange(e.target.value)}
        value={response}
      />
    </div>
  );
};
export default OpenEnded;
