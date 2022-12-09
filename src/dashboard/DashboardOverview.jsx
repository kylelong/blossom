import React, {useEffect, useState, useCallback} from "react";
import {auth, app} from "../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";

import {
  getFirestore,
  getDocs,
  where,
  query,
  orderBy,
  collection,
} from "firebase/firestore";
import Welcome from "./Welcome";

const DashboardOverview = () => {
  const [user] = useAuthState(auth);
  const db = getFirestore(app);
  const uid = user.uid;
  const [surveys, setSurveys] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadSurveys = useCallback(async () => {
    // TODO: put in global function file
    const q = query(
      collection(db, "surveys"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const querySnapShot = await getDocs(q);
    if (!querySnapShot.empty) {
      querySnapShot.forEach((doc) => {
        let {survey, surveyName, redirectUrl, createdAt, updatedAt} =
          doc.data();
        let date = new Date(createdAt.seconds * 1000);
        let formattedDate = date.toDateString();
        let surveyData = {
          id: doc.id,
          survey: survey,
          surveyName: surveyName,
          redirectUrl: redirectUrl,
          date: formattedDate,
          updatedAt: updatedAt,
        };

        setSurveys((prevState) => {
          let current = [...prevState];
          current.push(surveyData);
          return current;
        });
      });
    }
    setLoaded(true);
  }, [db, uid]);

  useEffect(() => {
    loadSurveys();
  }, [loadSurveys]);
  if (loaded && surveys.length === 0) {
    return <Welcome />;
  }
  return (
    <div>
      {surveys.length > 0 && (
        <>
          <div># of surveys {surveys.length}</div>
        </>
      )}
    </div>
  );
};
export default DashboardOverview;
