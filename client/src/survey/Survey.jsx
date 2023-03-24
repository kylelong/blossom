import React, {useEffect, useState, useCallback} from "react";
import {useParams} from "react-router-dom";
import "./survey.css";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";
import axios from "axios";

import SurveyViewer from "./SurveyViewer";

const Survey = () => {
  const params = useParams();
  const endpoint = "http://localhost:5000";

  const [survey, setSurvey] = useState({
    hash: "",
    id: 0,
    published: false,
    redirect_url: "",
    title: "",
  });
  const [response, setResponse] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [invalidSurvey, setInvalidSurvey] = useState(false);
  // TODO: add response ref
  const loadAnswers = async (questions) => {
    let question_copy = [];
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];

      let {id} = question;
      let question_array = questions.filter((question) => question.id === id);

      try {
        const response = await axios.get(
          `http://localhost:5000/answer_choices/${id}`
        );
        const data = await response.data;
        question_array[0].answerChoices = data;
        question_copy.push(question_array);
      } catch (err) {
        console.error(err.message);
      }
    }

    setQuestions(question_copy.flat());
  };

  const loadQuestions = useCallback(async (survey_id) => {
    try {
      const response = await axios.get(`${endpoint}/questions/${survey_id}`);
      const data = await response.data;
      if (data && data.length) {
        setQuestions(data);
        // loop through and set question id
        if (localStorage.getItem("bsmr") === null) {
          let r = [];
          for (let i = 0; i < data.length; i++) {
            let question = data[i];
            r.push({question_hash: question.hash, answers: []});
          }
          setResponse(r);
        }

        loadAnswers(data);
      }
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  useEffect(() => {
    const loadSurvey = async () => {
      let survey_hash = "";
      try {
        const response = await axios.get(`${endpoint}/survey/${params.id}`);
        const data = await response.data;
        if (data && data.length) {
          setSurvey(data[0]);
          loadQuestions(data[0].id);
          survey_hash = data[0].hash;
          setLoaded(true);
        } else {
          setInvalidSurvey(true);
        }
      } catch (err) {
        console.error(err.message);
      }

      // prefill answer choices from local storage
      if (localStorage.getItem("bsmr") !== null) {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        if (Object.keys(bsmr).includes(survey_hash)) {
          let res = bsmr[survey_hash];
          setResponse(res);
        }
      }
    };
    if (!loaded) {
      loadSurvey();
    }
  }, [survey, params.id, loadQuestions, loaded]);

  /**
   * update response array with selected answer choices
   * and answer indices
   */
  const updateResponse = useCallback(
    (index, type, answer) => {
      // answers: [{answer_id: "", answer: ""}] // answer_id for ms/ss, answer only for emoji / open_ended
      // for ms/ss append , open_ended / emoji overwrite
      let copy = [...response];
      if (answer) {
        copy[index].answers = answer;
      }
      setResponse(copy);
      let hash = survey.hash;
      if (localStorage.getItem("bsmr") === null) {
        let bsmr = {};
        bsmr[hash] = copy;
        localStorage.setItem("bsmr", JSON.stringify(bsmr));
      } else {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        bsmr[hash] = copy;
        localStorage.setItem("bsmr", JSON.stringify(bsmr));
      }
    },
    [response, survey.hash]
  );

  const submitSurvey = async () => {
    // TODO: loop through response ans make db calls
    console.log(response);
  };
  if (invalidSurvey) {
    return <div>Survey is not available or have not been published yet.</div>;
  }
  // make sure id is valid or so error page
  return (
    <div className="surveyParentContainer">
      <div className="logoContainer">
        <Logo />
        <img src={flower} alt="flower" className="flowerLogoImg" />
      </div>
      <SurveyViewer
        questions={questions}
        surveyName={survey.title}
        questionHash={null}
        updateResponse={updateResponse}
        submitSurvey={submitSurvey}
        redirectUrl={survey.redirect_url}
        surveyHash={survey.hash}
      />
    </div>
  );
};
export default Survey;
