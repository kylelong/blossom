import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {auth, app} from "../firebase-config";
// import {useAuthState} from "react-firebase-hooks/auth";
/*
getDocs,
  where,
  query,
  orderBy,
  collection,
  */

import {getFirestore, getDoc, doc} from "firebase/firestore";

const Survey = () => {
  const params = useParams();
  const db = getFirestore(app);
  const [surveyId, setSurveyId] = useState("");
  const [isValidSurvey, setIsValidSurvey] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const validSurvey = async () => {
    console.log(surveyId);
    if (surveyId) {
      const docRef = doc(db, "surveys", surveyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("document exists");
        setIsValidSurvey(true);
      } else {
        console.log("doc does not exists");
      }
    }
    setLoaded(true); // TODO: may need to move this
  };
  useEffect(() => {
    setSurveyId(params.id);
    validSurvey();
  }, [surveyId]);

  // make sure id is valid or so error page
  if (loaded && isValidSurvey) {
    return <div>take survey {params.id}</div>;
  } else {
    return <div>{loaded && !isValidSurvey && <div>invalid survey</div>}</div>;
  }
};
export default Survey;
