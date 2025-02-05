import React, {useState, useEffect, useRef, useCallback, useMemo} from "react";

const Emojis = ({index, handleProceed, updateResponse, surveyHash}) => {
  const emojis = useMemo(
    () => ({
      angry: "0x1F621",
      sad: "0x1F614",
      neutral: "0x1F611",
      happy: "0x1F60A",
      love: "0x1F60D",
    }),
    []
  );
  const getEmojiFromStorage = useCallback(
    (index) => {
      if (localStorage.getItem("bsmr") !== null) {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        if (Object.keys(bsmr).includes(surveyHash)) {
          let res = bsmr[surveyHash];
          if (res[index].answers && res[index].answers.length > 0) {
            let hex = res[index].answers[0].answer;
            const filtered = Object.entries(emojis).filter(
              ([key, value]) => value === hex
            );
            return filtered[0][0];
          }
        }
      }
      return "";
    },
    [surveyHash, emojis]
  );
  const [emoji, setEmoji] = useState(getEmojiFromStorage(index));
  const indexRef = useRef(index);
  const emojiRef = useRef(emoji);
  const handleEmojis = (key) => {
    if (Object.keys(emojis).includes(key)) {
      setEmoji(key);
    }
  };
  useEffect(() => {
    if (index !== indexRef.current) {
      setEmoji(getEmojiFromStorage(index));
    }
    if (emojiRef.current !== emoji && emoji.length > 0) {
      updateResponse(index, "emoji_sentiment", [
        {
          hash: "",
          answer: emojis[emoji],
        },
      ]);
    }
    handleProceed(indexRef.current === index && emoji.length > 0);
    indexRef.current = index;
    emojiRef.current = emoji;
  }, [
    handleProceed,
    emoji.length,
    index,
    emoji,
    emojis,
    getEmojiFromStorage,
    updateResponse,
  ]);
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
