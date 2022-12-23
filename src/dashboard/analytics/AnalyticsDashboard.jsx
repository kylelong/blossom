import React, {useEffect, useState} from "react";
import {auth, app} from "../../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";

import {
  getFirestore,
  getDocs,
  where,
  query,
  orderBy,
  collection,
} from "firebase/firestore";
import Welcome from "../Welcome";

const AnalyticsDashboard = () => {
  const [loaded, setLoaded] = useState(false);
  const [user] = useAuthState(auth);
  const db = getFirestore(app);
  const uid = user.uid;
  const [surveys, setSurveys] = useState([]);
  useEffect(() => {
    const loadSurveys = async () => {
      const q = query(
        collection(db, "surveys"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
      );
      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        querySnapShot.forEach((doc) => {
          let {
            survey,
            surveyName,
            redirectUrl,
            createdAt,
            updatedAt,
            published,
          } = doc.data();
          let date = new Date(createdAt.seconds * 1000);
          let formattedDate = date.toDateString();
          let baseUrl = `https://www.blossomsurveys.io/${doc.id}`;
          let surveyData = {
            id: doc.id,
            survey: survey,
            surveyName: surveyName.length > 0 ? surveyName : `untitled survey`,
            redirectUrl: redirectUrl,
            date: formattedDate,
            updatedAt: updatedAt,
            surveyLink: baseUrl,
            published: published,
          };

          setSurveys((prevState) => {
            let current = [...prevState];
            current.push(surveyData);
            return current;
          });
        });
      }
      setLoaded(true);
    };
    if (!loaded) {
      loadSurveys();
    }
  }, [db, loaded, uid]);
  if (loaded && surveys.length === 0) {
    return <Welcome />;
  }
  return (
    <>
      {loaded && (
        <div>
          <p>yoooo</p>
        </div>
      )}
    </>
  );
};
export default AnalyticsDashboard;
