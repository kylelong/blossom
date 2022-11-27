import React from "react";

const Emojis = () => {
  const emojis = {
    angry: "&#128545",
  };
  return (
    <div className="emojiContainer">
      <div className="emoji">&#128545;</div>
      <div className="emoji">&#128532;</div>
      <div className="emoji">&#128529;</div>
      <div className="emoji">&#128522;</div>
      <div className="emoji">&#128525;</div>
    </div>
  );
};
export default Emojis;
