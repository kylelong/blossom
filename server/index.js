const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

/**
 try {

  } catch (err){
    console.error(err.message);
  }
 */

// DASHBOARD

// # of surveys a user has created
app.get("/survey_count/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const count = await pool.query(
      "SELECT COUNT(*) FROM survey WHERE user_id = $1",
      [user_id]
    );
    res.json(count.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// # of questions a user has created
app.get("/question_count/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const count = await pool.query(
      "SELECT COUNT(q.id) from survey s INNER JOIN question q ON s.id = q.survey_id WHERE s.user_id = $1",
      [user_id]
    );
    res.json(count.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// ** CREATE **
app.post("/create_survey", async (req, res) => {
  try {
    const {title, hash, user_id} = req.body;
    const survey = await pool.query(
      "INSERT INTO survey (title, hash, user_id) VALUES($1, $2, $3) RETURNING id, hash",
      [title, hash, user_id]
    );
    res.json(survey.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get latest draft
app.get("/latest_survey/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const titles = await pool.query(
      "SELECT title, id, hash, published, redirect_url FROM survey WHERE user_id = $1 AND published = false ORDER BY created_at DESC",
      [user_id]
    );
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// add question to survey
app.post("/add_question", async (req, res) => {
  try {
    const {survey_id, index} = req.body;
    const question = await pool.query(
      "INSERT INTO question (survey_id, index) VALUES($1, $2) RETURNING id, index",
      [survey_id, index]
    );
    res.json(question.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update question_title
app.put("/update_question_title/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const {question_id, title} = req.body;
    const update = await pool.query(
      "UPDATE question SET title = $1 WHERE id = $2 AND survey_id = $3",
      [title, question_id, survey_id]
    );
    res.json("question title updated!");
  } catch (err) {
    console.error(error.message);
  }
});

//TODO:   update question_type
app.put("/update_question_type/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const {question_id, type} = req.body;
    const update = await pool.query(
      "UPDATE question SET type = $1 WHERE id = $2 AND survey_id = $3",
      [type, question_id, survey_id]
    );
    res.json("question type updated!");
  } catch (err) {
    console.error(error.message);
  }
});

// publish survey
app.put("/publish_survey/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const update = await pool.query(
      "UPDATE survey SET published = true WHERE id = $1",
      [survey_id]
    );
    res.json("survey published!");
  } catch (err) {
    console.error(error.message);
  }
});

// update survey_title
app.put("/update_survey_title/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const {title} = req.body;
    const update = await pool.query(
      "UPDATE survey SET title = $1 WHERE id = $2",
      [title, survey_id]
    );
    res.json("survey title updated!");
  } catch (err) {
    console.error(error.message);
  }
});

// update redirect_url
app.put("/update_redirect_url/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const {redirect_url} = req.body;
    const update = await pool.query(
      "UPDATE survey SET redirect_url = $1 WHERE id = $2",
      [redirect_url, survey_id]
    );
    res.json("redirect_url updated!");
  } catch (err) {
    console.error(error.message);
  }
});

// delete survey
app.delete("/delete_survey/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const deletion = await pool.query("DELETE FROM survey WHERE id = $1", [
      survey_id,
    ]);
    res.json(`survey #${id} deleted!`);
  } catch (err) {
    console.error(error.message);
  }
});

// delete question
app.delete("/delete_question/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const {question_id} = req.body;
    const deletion = await pool.query(
      "DELETE FROM question WHERE survey_id = $1 AND question_id = $2",
      [survey_id, question_id]
    );
    res.json(`survey #${id} deleted!`);
  } catch (err) {
    console.error(error.message);
  }
});

// ** SURVEYS **

// get lastest unpublished survey

// get all survey data form user id
app.get("/surveys/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const titles = await pool.query(
      "SELECT title, id, hash, published, redirect_url FROM survey WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get questions for a survey
app.get("/questions/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const questions = await pool.query(
      "SELECT id, title, type, index FROM question WHERE survey_id = $1 ORDER BY index ASC",
      [survey_id]
    );
    res.json(questions.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get answer choices for a question - DOES NOT apply to emoji & open_ended question typed questions

app.get("/answer_choices/:question_id", async (req, res) => {
  try {
    const {question_id} = req.params;
    const answers = await pool.query(
      "SELECT choice, id, index FROM answer_choice WHERE question_id = $1 ORDER BY index ASC",
      [question_id]
    );
    res.json(answers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
