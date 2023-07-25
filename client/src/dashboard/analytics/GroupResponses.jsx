import React, {useState, useEffect} from "react";
import axios from "axios";

import {
  ProgressButton,
  ProgressButtonContainer,
  Container,
  Question,
  QuestionType,
} from "./groupResponsesStyles";
import AnswerWrapper from "./AnswerWrapper";
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;
const GroupResponses = ({surveyId, responseHashes}) => {
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const length = responseHashes.length;

  const handleClick = () => {
    if (index === length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };
  const handlePreviousClick = () => {
    if (index === 0) {
      setIndex(length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  const getAnswerFromId = async (id) => {
    try {
      const response = await axios.get(`${endpoint}/answer_from_id/${id}`);
      const data = await response.data;
      console.log(data);
      return data[0].choice;
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    /**
     * answer_id: multi_select, single_select
     * answer: short_answer, open_ended, emoji_sentiment
     */
    if (responseHashes.length > 0 && index >= 0) {
      const loadResponses = async () => {
        const survey_id = surveyId;
        const response_hash = responseHashes[index].response_hash;
        try {
          const response = await axios.get(
            `${endpoint}/responses_by_hash/${survey_id}/${response_hash}`
          );
          const data = await response.data;
          let r = {};
          for (let i = 0; i < data.length; i++) {
            const {question_id, title, answer, answer_id, type} = data[i];
            const hasAnswerId =
              type === "multi_select" || type === "single_select";
            if (r[question_id]) {
              if (hasAnswerId) {
                let answer_choice = await getAnswerFromId(answer_id);
                r[question_id].answers.push(answer_choice);
              } else {
                r[question_id].answers.push(answer);
              }
            } else {
              if (hasAnswerId) {
                let answer_choice = await getAnswerFromId(answer_id);
                r[question_id] = {
                  title: title,
                  type: type,
                  answers: [answer_choice],
                };
              } else {
                r[question_id] = {title: title, type: type, answers: [answer]};
              }
            }
          }
          setResponses(r);
        } catch (err) {
          console.error(err.message);
        }
      };
      loadResponses();
    }
  }, [index, responseHashes, surveyId]);
  if (responseHashes.length === 0) {
    return <div>no responses</div>;
  }
  return (
    <Container>
      {Object.entries(responses).map(([key, value]) => {
        const {title, type, answers} = value;
        return (
          <>
            <Question>
              {title}
              <QuestionType>{type}</QuestionType>
            </Question>
            <AnswerWrapper type={type} answers={answers} />
          </>
        );
      })}
      <ProgressButtonContainer>
        {length > 1 && index >= 1 && (
          <>
            <ProgressButton onClick={handlePreviousClick}>
              previous
            </ProgressButton>
          </>
        )}
        {length > 1 && index >= 0 && (
          <>
            <ProgressButton onClick={handleClick}>next</ProgressButton>
          </>
        )}
      </ProgressButtonContainer>
    </Container>
  );
};
export default GroupResponses;
