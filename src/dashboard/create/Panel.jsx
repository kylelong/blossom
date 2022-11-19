import React, {useState} from "react";
import {useForm} from "react-hook-form";
import * as Label from "@radix-ui/react-label";
// import {auth} from "../../firebase-config";
import QuestionPanel from "./questions/QuestionPanel";

// import {useAuthState} from "react-firebase-hooks/auth";
// import {getFirestore, doc, getDoc, updateDoc} from "firebase/firestore";
import "./panel.css";

const Panel = () => {
  // const [user] = useAuthState(auth);
  const {register, handleSubmit} = useForm();
  const [data, setData] = useState("");

  return (
    <form
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 5,
        alignItems: "start",
        flexDirection: "column",
      }}
      onChange={handleSubmit((data) => setData(JSON.stringify(data)))}
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
      <QuestionPanel />
      <button className="publishBtn panelBtn" type="submit">
        Publish
      </button>
      <div>{JSON.parse(data).surveyTitle}</div>
    </form>
  );
};
export default Panel;
