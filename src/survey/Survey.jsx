import React, {useEffect, useState, useCallback} from "react";
import {useParams} from "react-router-dom";
import {app} from "../firebase-config";
import "./survey.css";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";

import {
  getFirestore,
  getDoc,
  doc,
  serverTimestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import SurveyViewer from "./SurveyViewer";

const Survey = () => {
  const params = useParams();
  const db = getFirestore(app);
  const [surveyId, setSurveyId] = useState("");

  const [survey, setSurvey] = useState([]);
  const [surveyName, setSurveyName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [response, setResponse] = useState([]);
  // TODO: add response ref

  useEffect(() => {
    setSurveyId(params.id); //TODO: make sure survey id is valid
    // console.log(redirectUrl); //TODO: remove redirectUrl
    const loadSurvey = async () => {
      if (surveyId) {
        const docRef = doc(db, "surveys", surveyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          let {survey, surveyName, redirectUrl} = docSnap.data();
          setSurveyName(surveyName);
          setSurvey(survey);
          let res = new Array(survey.length);
          for (let i = 0; i < survey.length; i++) {
            res[i] = {
              questionHash: survey[i].hash,
              answerChoices: [],
              answerIndices: [],
            };
          }

          setResponse(res);
          if (redirectUrl) {
            setRedirectUrl(redirectUrl);
          }
        }

        // prefill answer choices from local storage
        if (localStorage.getItem("bsmr") !== null) {
          let bsmr = JSON.parse(localStorage.getItem("bsmr"));
          if (Object.keys(bsmr).includes(surveyId)) {
            let res = bsmr[surveyId];
            setResponse(res);
            // console.log(res);
          }
        }
      }
    };
    loadSurvey();
  }, [surveyId, params.id, db, redirectUrl]);

  /**
   * update response array with selected answer choices
   * and answer indices
   */
  const updateResponse = useCallback(
    (index, answerChoices, answerIndices) => {
      let copy = [...response];
      copy[index].answerChoices = answerChoices;
      copy[index].answerIndices = answerIndices;
      setResponse(copy);
      let id = surveyId;
      if (localStorage.getItem("bsmr") === null) {
        let bsmr = {};
        bsmr[id] = copy;
        localStorage.setItem("bsmr", JSON.stringify(bsmr));
      } else {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        bsmr[id] = copy;
        localStorage.setItem("bsmr", JSON.stringify(bsmr));
      }
    },
    [response, surveyId]
  );

  const submitSurvey = async () => {
    try {
      await addDoc(collection(db, "responses"), {
        surveyId: surveyId,
        createdAt: serverTimestamp(),
        response: response,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // make sure id is valid or so error page
  return (
    <div className="surveyParentContainer">
      <div className="logoContainer">
        <Logo />
        <img src={flower} alt="flower" className="flowerLogoImg" />
      </div>
      <SurveyViewer
        questions={survey}
        surveyName={surveyName}
        questionHash={null}
        updateResponse={updateResponse}
        submitSurvey={submitSurvey}
        redirectUrl={redirectUrl}
        surveyId={surveyId}
      />
    </div>
  );
};
export default Survey;
