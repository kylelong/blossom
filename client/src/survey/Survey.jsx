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
        console.log(data);
        // loop through and set question id
        let r = [];
        for (let i = 0; i < data.length; i++) {
          let question = data[i];
          r.push({question_id: question.id, answers: []});
        }
        setResponse(r);
        loadAnswers(data);
      }
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        const response = await axios.get(`${endpoint}/survey/${params.id}`);
        const data = await response.data;
        if (data && data.length) {
          setSurvey(data[0]);
          loadQuestions(data[0].id);
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
        if (Object.keys(bsmr).includes(survey.id)) {
          let res = bsmr[survey.id];
          setResponse(res);
          // console.log(res);
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
      if (
        type === "open_ended" ||
        type === "emoji_sentiment" ||
        type === "single_select"
      ) {
        copy[index].answers = answer;
      } else if (type === "multi_select") {
        // if it does not contain id
        let found =
          copy[index].answers.filter((el) => el.answer_id === answer.answer_id)
            .length > 0;
        if (!found) {
          copy[index].answers.push(answer);
        } else if (found) {
          let idx = copy[index].answers.findIndex(
            (el) => el.answer_id === answer.answer_id
          );
          copy[index].answers.splice(idx, 1);
        }
      }

      setResponse(copy);
      let id = survey.id.toString();
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
    [response, survey.id]
  );

  const submitSurvey = async () => {};
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
      <div>{JSON.stringify(response, null, 2)}</div>
      <SurveyViewer
        questions={questions}
        surveyName={survey.title}
        questionHash={null}
        updateResponse={updateResponse}
        submitSurvey={submitSurvey}
        redirectUrl={survey.redirect_url}
        surveyId={survey.id}
      />
    </div>
  );
};
export default Survey;
