import React from "react";
import styled from "styled-components";

export const EmojiStatContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 6px;
`;
export const Stat = styled.div`
  margin-right: 3px;
  margin-left: 3px;
`;
export const Dot = styled.span`
  height: 5px;
  width: 5px;
  background-color: #525f7f;
  border-radius: 50%;
  display: inline-block;
  margin-right: 3px;
`;
const EmojiStat = ({emoji, emojiAnalytics}) => {
  let index = emojiAnalytics.findIndex((em) => em.answer === emoji);
  if (index > -1) {
    const analytics = emojiAnalytics[index];
    return (
      <EmojiStatContainer>
        <Stat>{`${analytics.count}/${analytics.total}`}</Stat>
        <Dot />
        <Stat style={{marginLeft: "2px"}}>{`${analytics.avg * 100}%`}</Stat>
      </EmojiStatContainer>
    );
  }
};
export default EmojiStat;
