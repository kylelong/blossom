import React, {useEffect, useState} from "react";
import {auth, app} from "../firebase-config";
import {useAuthState} from "react-firebase-hooks/auth";

import {
  getFirestore,
  getDocs,
  where,
  query,
  orderBy,
  collection,
  limit,
} from "firebase/firestore";
import Welcome from "./Welcome";
import {
  DashboardStatHeader,
  DashboardOverviewHeader,
  DashboardOverviewContainer,
  DashboardStat,
  DashboardNumber,
  DashboardStatContainer,
  SurveyButton,
  QuestionTypeBreakdown,
  QuestionTypeItem,
  QuestionTypeLabel,
  QuestionTypeNumber,
} from "./dashboardStyles";

const DashboardOverview = () => {
  const [user] = useAuthState(auth);
  const defaultQuestionTypes = {
    single_select: 0,
    multi_select: 0,
    emoji_sentiment: 0,
    open_ended: 0,
  };
  const db = getFirestore(app);
  const uid = user.uid;
  const [surveys, setSurveys] = useState([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [questionTypes, setQuestionTypes] = useState(defaultQuestionTypes);
  const [loaded, setLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const loadSurveys = async () => {
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
          // collect total number of questions
          setNumberOfQuestions((prevState) => {
            return prevState + survey.length;
          });

          survey.forEach((s) => {
            setQuestionTypes((prevState) => {
              let copy = prevState;
              prevState[s.questionType] = prevState[s.questionType] + 1;
              return copy;
            });
          });

          setSurveys((prevState) => {
            let current = [...prevState];
            current.push(surveyData);
            return current;
          });
        });
      }
      setLoaded(true);
    };

    const hasDraftSurvey = async (uid) => {
      // get latest draft
      try {
        const q = query(
          collection(db, "surveys"),
          where("uid", "==", uid),
          where("published", "==", false),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapShot = await getDocs(q);
        if (!querySnapShot.empty) {
          setHasDraft(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (!loaded) {
      loadSurveys();
      hasDraftSurvey(uid);
    }
  }, [loaded, uid, db]);
  if (loaded && surveys.length === 0) {
    return <Welcome />;
  }
  const randomNumber = () => {
    let min = 100,
      max = 10000;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const buttonText = hasDraft
    ? `finish your draft survey ${String.fromCodePoint("0x1F91D")}`
    : `create a new survey ${String.fromCodePoint("0x1F680")}`;

  return (
    <div>
      {(surveys.length > 0 || hasDraft) && (
        <DashboardOverviewContainer>
          <DashboardOverviewHeader>surveys overview</DashboardOverviewHeader>
          <DashboardStatContainer>
            {surveys.length > 0 && (
              <DashboardStat>
                <DashboardNumber>{surveys.length}</DashboardNumber>
                <DashboardStatHeader>surveys</DashboardStatHeader>
              </DashboardStat>
            )}

            {numberOfQuestions > 0 && (
              <DashboardStat>
                <DashboardNumber>{numberOfQuestions}</DashboardNumber>
                <DashboardStatHeader>questions </DashboardStatHeader>
              </DashboardStat>
            )}
            {/* TODO: pull responses*/}
            <DashboardStat>
              <DashboardNumber>{randomNumber()}</DashboardNumber>
              <DashboardStatHeader>responses</DashboardStatHeader>
            </DashboardStat>
          </DashboardStatContainer>
          <QuestionTypeBreakdown>
            <DashboardOverviewHeader>question types </DashboardOverviewHeader>
            {Object.keys(questionTypes).map((key, index) => {
              return (
                <>
                  <QuestionTypeItem key={index}>
                    <QuestionTypeLabel>{key}</QuestionTypeLabel>
                    <QuestionTypeNumber>
                      {questionTypes[key]}
                    </QuestionTypeNumber>
                  </QuestionTypeItem>
                </>
              );
            })}
          </QuestionTypeBreakdown>

          <a href="/create">
            <SurveyButton>{buttonText}</SurveyButton>
          </a>
        </DashboardOverviewContainer>
      )}
    </div>
  );
};
export default DashboardOverview;
