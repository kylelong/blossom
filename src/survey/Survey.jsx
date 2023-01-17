import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {auth, app} from "../firebase-config";
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
  // const [isValidSurvey, setIsValidSurvey] = useState(false);
  // const [loaded, setLoaded] = useState(false);
  const [survey, setSurvey] = useState([]);
  const [surveyName, setSurveyName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    setSurveyId(params.id);
    const loadSurvey = async () => {
      if (surveyId) {
        const docRef = doc(db, "surveys", surveyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          let {survey, surveyName, redirectUrl} = docSnap.data();
          setSurveyName(surveyName);
          setSurvey(survey);
          if (redirectUrl) {
            setRedirectUrl(redirectUrl);
          }
          // setIsValidSurvey(true);
        }
      }
      // setLoaded(true);
    };
    loadSurvey();
  }, [surveyId, params.id, db]);

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
      />
    </div>
  );
};
export default Survey;
