import React, {useState, useRef, useEffect} from "react";
const OpenEnded = ({handleProceed, index}) => {
  const [response, setResponse] = useState("");
  const indexRef = useRef(index);
  const handleChange = (input) => {
    setResponse(input);
    console.log(response);
  };
  useEffect(() => {
    handleProceed(index === indexRef.current || response.length > 0);
    indexRef.current = index;
  }, [index, handleProceed, response.length]);
  return (
    <div>
      <textarea
        rows="7"
        cols="50"
        className="openEndedTextArea"
        placeholder="Enter your answer..."
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
export default OpenEnded;
