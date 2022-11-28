import React, {useState} from "react";

const Emojis = () => {
  const emojis = {
    angry: "0x1F621",
    sad: "0x1F614",
    neutral: "0x1F611",
    happy: "0x1F60A",
    love: "0x1F60D",
  };
  const [emoji, setEmoji] = useState("");
  const handleEmojis = (key) => {
    if (Object.keys(emojis).includes(key)) {
      setEmoji(key);
    }
  };
  return (
    <div className="emojiContainer">
      {Object.entries(emojis).map(([key, value]) => {
        if (key === emoji) {
          return (
            <div
              className="emojiSelected"
              key={key}
              onClick={() => handleEmojis(key)}
            >
              {String.fromCodePoint(value)}
            </div>
          );
        } else {
          return (
            <div className="emoji" key={key} onClick={() => handleEmojis(key)}>
              {String.fromCodePoint(value)}
            </div>
          );
        }
      })}
    </div>
  );
};
export default Emojis;
