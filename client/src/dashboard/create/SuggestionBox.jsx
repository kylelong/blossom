import React, {useState, useEffect, useRef} from "react";
import styled, {keyframes} from "styled-components";

export const Container = styled.div`
  position: relative;
  right: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Header = styled.div`
  font-size: 20px;
  font-weight: bold;
  line-height: 35px;
  color: #525f7f;
  margin-bottom: 8px;
`;
export const Box = styled.div`
  //   background-color: #faf9f6;
  padding: 12px;
  border: 1px solid #355e3b;
  width: 46vw;
  height: 300px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
export const Content = styled.div`
  margin-top: 12px;
  width: 100%;
`;
export const Sample = styled.div`
  opacity: ${({visible}) => (visible ? "1" : "0")};
  transition: opacity 0.5s ease-in-out;
  animation: ${({visible}) => (visible ? fadeIn : fadeOut)} 0.5s ease-in-out;
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: bold;
`;
export const InputBox = styled.input`
  margin-bottom: 10px;
  width: 302px;
  height: 38px;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 400;
  border: 1px solid #c4c4c4;
  border-radius: 3px;
  padding-left: 5px;
`;
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const SuggestionBox = () => {
  const sampleQuestions = [
    "questions to better understand our users",
    "feedback as a product manager",
    "how can i improve as a freelance designer?",
    "sign up form for beta users",
    "short quiz for my students",
    "registration form for my pop up event",
    "feedback on the changes to our designs",
  ];
  const [visible, setVisible] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [sample, setSample] = useState(
    sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
  );
  const sampleRef = useRef(sample);

  const handleChange = (e) => {
    setPhrase(e.target.value);
    console.log(e.target.value);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        let randomPhrase =
          sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
        if (sampleRef.current === randomPhrase) {
          while (randomPhrase === sampleRef.current) {
            randomPhrase =
              sampleQuestions[
                Math.floor(Math.random() * sampleQuestions.length)
              ];
          }
        }
        sampleRef.current = randomPhrase;
        setSample(randomPhrase);
        setVisible(true);
      }, 500);
    }, 3500);

    return () => {
      clearInterval(interval);
    };
  });
  return (
    <Container>
      <Header>smart question suggestion &#x1F52E;</Header>
      <Box>
        <Content>
          <Sample visible={visible}>{sample}</Sample>
          <InputBox
            type="text"
            placeholder="What kind of survey are you building?"
            name="suggestion"
            onChange={handleChange}
          />
        </Content>
      </Box>
    </Container>
  );
};
export default SuggestionBox;
