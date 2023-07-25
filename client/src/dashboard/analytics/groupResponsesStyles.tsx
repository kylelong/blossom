import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: left;
  flex-direction: column;
`;
export const ProgressButtonContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: auto;
  margin-bottom: 8px;
`;
export const ProgressButton = styled.button`
  all: unset;
  margin-top: 15px;
  margin-right: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  font-size: 16px;
  padding: 0 15px;
  line-height: 35px;
  height: 38px;
  width: 100px;
  background-color: white;
  color: #355e3b;
  box-shadow: 0 2px 10px var(--blackA7);
`;

export const Question = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.375rem;
  border: 1px solid black;
  background-color: hsl(300, 7.7%, 97.5%);
  padding: 12px;
  margin-bottom: 12px;
  text-align: left;
  &:hover {
    cursor: pointer;
  }
`;
export const QuestionType = styled.div`
  color: rgb(60, 66, 87);
  background: rgb(247, 250, 252);
  border: 1px solid #efefef;
  padding: 2px;
  font-size: 13px;
  border-radius: 5px;
  width: fit-content;
  padding: 2px 5px;
  margin-top: 12px;
`;
