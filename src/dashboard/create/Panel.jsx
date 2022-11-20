import React, {useState, useEffect, useCallback} from "react";
import {useForm} from "react-hook-form";
import * as Label from "@radix-ui/react-label";
// import {auth} from "../../firebase-config";
// import {useAuthState} from "react-firebase-hooks/auth";
// import {getFirestore, doc, getDoc, updateDoc} from "firebase/firestore";
import QuestionPanel from "./questions/QuestionPanel";
import "./panel.css";

const Panel = () => {
  // const [user] = useAuthState(auth);
  const {register, handleSubmit} = useForm();
  const [data, setData] = useState("Survey Title");
  const [surveyName, setSurveyName] = useState("Survey Title");
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    if (surveyName.length === 0) {
      setSurveyName("Survey Title");
    }
  }, [surveyName, questionData]);

  const getQuestions = (questions) => {
    setQuestionData(questions);
  };

  const updateQuestion = useCallback(
    (hash, title) => {
      let copy = questionData;
      let index = copy.findIndex((element) => element.hash === hash);
      copy[index].questionTitle = title;
      setQuestionData(copy);
      console.log(questionData);
    },
    [questionData]
  );

  return (
    <div className="panelContainer">
      <div className="surveyContainer">
        <div className="surveyName">{surveyName}</div>
        {questionData.map((question, index) => {
          return (
            <div key={index}>
              {question.hash} - {question.questionTitle}
            </div>
          );
        })}
      </div>
      <div className="formContainer">
        <form
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            alignItems: "start",
            flexDirection: "column",
          }}
          onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))}
        >
          <Label.Root className="LabelRoot" htmlFor="surveyTitle">
            Survey Title:
          </Label.Root>
          <input
            {...register("surveyTitle")}
            onChange={(e) => setSurveyName(e.target.value)}
            className="Input"
            type="text"
            name="surveyTitle"
            id="surveyTitle"
          />
          <QuestionPanel
            getQuestions={getQuestions}
            updateQuestion={updateQuestion}
          />
          <button className="publishBtn panelBtn" type="submit">
            Publish
          </button>
        </form>
      </div>
    </div>
  );
};
export default Panel;
