import React, {useEffect, useState, useCallback} from "react";
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
import SurveyPreview from "../surveyPreview/SurveyPreview";
import Welcome from "../Welcome";
import * as RadioGroup from "@radix-ui/react-radio-group";
import "./surveys.css";

const SurveysList = () => {
  const [user] = useAuthState(auth);
  const db = getFirestore(app);
  const uid = user.uid;
  const [surveys, setSurveys] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentSurveyindex, setCurrentSurveyIndex] = useState(0);

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

  const RadioDemo = () => {
    return (
      <>
        <form>
          <RadioGroup.Root
            className="RadioGroupRoot"
            defaultValue={0}
            aria-label="View density"
          >
            {surveys.map((survey, index) => {
              return (
                <div
                  style={{display: "flex", alignItems: "center"}}
                  key={index}
                >
                  <RadioGroup.Item
                    className="RadioGroupItem"
                    value={index}
                    id={index}
                    onClick={() => {
                      setCurrentSurveyIndex(index);
                    }}
                  >
                    <RadioGroup.Indicator className="RadioGroupIndicator" />
                  </RadioGroup.Item>
                  <label className="Label" htmlFor="r1">
                    {survey.surveyName}
                  </label>
                </div>
              );
            })}
          </RadioGroup.Root>
        </form>
      </>
    );
  };

  useEffect(() => {
    loadSurveys();
  }, [loadSurveys]);

  // <SurveyPreview questions={survey} />
  if (loaded && surveys.length === 0) {
    return <Welcome />;
  }

  return (
    <div className="surveyListContainer">
      <div className="surveySelectorContainer">
        <div className="listHeader">created surveys</div>
        {RadioDemo()}
      </div>
      {surveys.length > 0 && (
        <SurveyPreview questions={surveys[currentSurveyindex].survey} />
      )}
    </div>
  );
};

export default SurveysList;
