import React, {useEffect, useState, useCallback} from "react";
import {useParams} from "react-router-dom";
import {app} from "../firebase-config";
import "./survey.css";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";
// import {useAuthState} from "react-firebase-hooks/auth";
/*
getDocs,
  where,
  query,
  orderBy,
  collection,
  */

import {getFirestore, getDoc, doc} from "firebase/firestore";
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
    setSurveyId(params.id); //TODO: make sure survey id is
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
    },
    [response]
  );

  const submitSurvey = () => {
    //TODO: set completed to true
    console.log(response);
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
