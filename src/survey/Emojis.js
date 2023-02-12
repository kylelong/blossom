import React, {useState, useEffect, useRef} from "react";

const Emojis = ({questionHash, index, handleProceed, updateResponse}) => {
  const emojis = {
    angry: "0x1F621",
    sad: "0x1F614",
    neutral: "0x1F611",
    happy: "0x1F60A",
    love: "0x1F60D",
  };
  const [emoji, setEmoji] = useState("");
  const indexRef = useRef(index);
  const emojiRef = useRef(emoji);
  const handleEmojis = (key) => {
    if (Object.keys(emojis).includes(key)) {
      setEmoji(key);
    }
  };
  useEffect(() => {
    if (index !== indexRef.current) {
      setEmoji("");
    }
    if (emojiRef.current !== emoji) {
      updateResponse(index, [emojis[emoji]], [-1]);
    }
    handleProceed(indexRef.current === index || emoji.length > 0);
    indexRef.current = index;
    emojiRef.current = emoji;
  }, [handleProceed, emoji.length, index, emoji, emojis]);
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
