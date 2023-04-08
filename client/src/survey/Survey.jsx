import React, {useEffect, useState, useCallback} from "react";
import {useParams} from "react-router-dom";
import "./survey.css";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";
import axios from "axios";

import SurveyViewer from "./SurveyViewer";
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

const Survey = () => {
  const params = useParams();

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
  const [questionIds, setQuestionIds] = useState([]);
  // TODO: add response ref
  const loadAnswers = async (questions) => {
    let question_copy = [];
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];

      let {id} = question;
      let question_array = questions.filter((question) => question.id === id);

      try {
        const response = await axios.get(`${endpoint}/answer_choices/${id}`);
        const data = await response.data;
        question_array[0].answerChoices = data;
        question_copy.push(question_array);
      } catch (err) {
        console.error(err.message);
      }
    }

    setQuestions(question_copy.flat());
  };

  const getQuestionId = async (hash) => {
    try {
      let response = await axios.get(`${endpoint}/get_question_id/${hash}`);
      let data = await response.data;
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };

  const loadQuestions = useCallback(
    async (survey_id) => {
      try {
        const response = await axios.get(`${endpoint}/questions/${survey_id}`);
        const data = await response.data;
        if (data && data.length) {
          setQuestions(data);
          // loop through and set question id
          if (localStorage.getItem("bsmr") === null) {
            let r = [];
            async function prefillResponse() {
              for (let i = 0; i < data.length; i++) {
                let question = data[i];
                r.push({question_hash: question.hash, answers: []});
                let question_id = await getQuestionId(question.hash);
                setQuestionIds((prevState) => [...prevState, question_id]);
              }
              let bsmr = {};
              bsmr[params.id] = r;
              localStorage.setItem("bsmr", JSON.stringify(bsmr));
              setResponse(r);
            }
            prefillResponse();
          }

          loadAnswers(data);
        }
      } catch (err) {
        console.error(err.message);
      }
    },
    [params.id]
  );

  useEffect(() => {
    // TODO: if localStorage.getItem("bsmr") != mull and key != params.id -> removeItem
    async function loadQuestionIds(res) {
      for (let i = 0; i < res.length; i++) {
        let question = res[i];
        let question_id = await getQuestionId(question.question_hash);
        setQuestionIds((prevState) => [...prevState, question_id]);
      }
    }

    const loadSurvey = async () => {
      let survey_hash = params.id;
      // prefill answer choices from local storage
      if (localStorage.getItem("bsmr") !== null) {
        let bsmr = JSON.parse(localStorage.getItem("bsmr"));
        if (Object.keys(bsmr).includes(survey_hash)) {
          let res = bsmr[survey_hash];
          loadQuestionIds(res);
          setResponse(res);
        } else {
          localStorage.removeItem("bsmr");
        }
      }
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
    };
    if (!loaded) {
      loadSurvey();
    }
  }, [survey, params.id, loadQuestions, loaded, questionIds]);

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

      let bsmr = JSON.parse(localStorage.getItem("bsmr"));
      bsmr[hash] = copy;
      localStorage.setItem("bsmr", JSON.stringify(bsmr));
    },
    [response, survey.hash]
  );

  const getAnswerChoiceId = async (hash) => {
    try {
      let response = await axios.get(
        `${endpoint}/get_answer_choice_id/${hash}`
      );
      let data = await response.data;
      return data;
    } catch (err) {
      console.error(err.message + " getting answer id");
    }
  };

  // text based answer for open_ended
  const insertAnswerResponse = async (answer, question_id) => {
    try {
      await axios.post(`${endpoint}/add_response_with_answer`, {
        answer: answer,
        question_id: question_id,
      });
    } catch (err) {
      console.error(`inserting answer with response: ${err.message}`);
    }
  };

  // multi_select / single_select
  const insertAnswerIdResponse = async (answer_id, question_id) => {
    try {
      await axios.post(`${endpoint}/add_response_with_answer_id`, {
        answer_id: answer_id,
        question_id: question_id,
      });
    } catch (err) {
      console.error(`inserting answer with id: ${err.message}`);
    }
  };

  const submitSurvey = async () => {
    for (let i = 0; i < response.length; i++) {
      let res = response[i];
      let question_id = questionIds[i];
      // loop through res.answers
      let answers = res.answers;
      for (let j = 0; j < answers.length; j++) {
        const {answer, hash} = answers[j];
        // single_select / multi_select answer with id
        if (hash.length > 0 && answer.length === 0) {
          (async function () {
            let answer_id = await getAnswerChoiceId(hash);
            (async function () {
              await insertAnswerIdResponse(answer_id, question_id);
            })();
          })();
        } else if (hash.length === 0 && answers.length > 0) {
          // add_response_with_answer for emojis / open_ended
          (async function () {
            await insertAnswerResponse(answer, question_id);
          })();
        }
      }
    }
  };
  if (invalidSurvey) {
    return (
      <div className="noSurveyContainer">
        <img src={flower} alt="flower" className="flowerLogoImg" />
        <div className="surveyMsg">
          this survey is not published yet {String.fromCodePoint("0x1F614")}
        </div>
      </div>
    );
  }
  // make sure id is valid or so error page
  return (
    <div className="surveyParentContainer">
      {loaded && (
        <>
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
          />{" "}
        </>
      )}
    </div>
  );
};
export default Survey;
