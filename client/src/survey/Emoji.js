import React, {useState} from "react";
const OpenEnded = () => {
  const [response, setResponse] = useState("");
  const handleChange = (input) => {
    setResponse(input);
  };
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
