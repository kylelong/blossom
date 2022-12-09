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
import styled from "styled-components";
import "./surveys.css";
import flower from "../../images/scandi-330.svg";

export const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
`;
export const Welcome = styled.div`
  font-size: 20px;
  margin-bottom: 22px;
`;

export const Flower = styled.img`
  height: 100;
  margin-bottom: 22px;
`;

/**
 * show list of survey ids for this user
 *  get surveys for each id
 *
 */

const SurveysList = () => {
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
    if (querySnapShot.empty) {
      console.log("empty");
    } else {
      console.log("not empty");
      querySnapShot.forEach((doc) => {
        let {survey, surveyName, redirectUrl, createdAt, updatedAt} =
          doc.data();
        let date = new Date(createdAt.seconds * 1000);
        let formattedDate = date.toDateString();
        let surveyData = {
          survey: survey,
          surveyName: surveyName,
          redirectUrl: redirectUrl,
          date: formattedDate,
          updatedAt: updatedAt,
        };
        console.log(surveyData);
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
  }, []);

  // <SurveyPreview questions={survey} />
  if (loaded && surveys.length === 0) {
    return (
      <WelcomeContainer>
        <Welcome>welcome to blossom &#x1F60A;</Welcome>
        <Flower src={flower} alt="flower" />
        <a href="/create">
          <button className="createBtn">
            create your first survey &#128640;
          </button>
        </a>
      </WelcomeContainer>
    );
  }

  return (
    <div>
      {surveys.length > 0 && <SurveyPreview questions={surveys[0].survey} />}
      {surveys.map((survey, index) => {
        return (
          <div key={index}>
            {survey.surveyName}-{survey.date}
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default SurveysList;
