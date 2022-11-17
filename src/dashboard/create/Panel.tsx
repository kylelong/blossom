import React, {useState} from "react";
import {useForm} from "react-hook-form";
import * as Label from "@radix-ui/react-label";
import {auth, app} from "../../firebase-config";
import Question from "./questions/Question";

import {useAuthState} from "react-firebase-hooks/auth";
import {getFirestore, doc, getDoc, updateDoc} from "firebase/firestore";
import {PlusCircledIcon} from "@radix-ui/react-icons";
import "./panel.css";

type createPanel = {
  surveyTitle: string;
};
const Panel: React.FC = () => {
  const [user] = useAuthState(auth);
  const [questions, setQuestion] = useState<React.ReactElement[]>([]);
  const {register, handleSubmit} = useForm<createPanel>({
    defaultValues: {
      surveyTitle: "",
    },
  });
  const onSubmit = handleSubmit(({surveyTitle}) => {
    console.log(surveyTitle);
  });

  const addQuestion = () => {
    let label = `Question ${questions.length + 1}`;
    setQuestion((questions) => [...questions, <Question label={label} />]);
  };

  return (
    <form
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 5,
        alignItems: "start",
        flexDirection: "column",
      }}
      onSubmit={onSubmit}
    >
      <Label.Root className="LabelRoot" htmlFor="surveyTitle">
        Survey Title:
      </Label.Root>
      <input
        {...register("surveyTitle")}
        className="Input"
        type="text"
        name="surveyTitle"
        id="surveyTitle"
      />
      <div>
        {questions.map((question, index) => {
          return <div key={index}>{question}</div>;
        })}
      </div>
      <button className="addQuestionBtn panelBtn" onClick={addQuestion}>
        Add Question <PlusCircledIcon style={{marginLeft: "5px"}} />
      </button>
      <button className="publishBtn panelBtn" type="submit">
        Publish
      </button>
    </form>
  );
};
export default Panel;
