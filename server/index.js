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
      "UPDATE question SET title = $1 WHERE id = $2 AND survey_id = $3 RETURNING title",
      [title, question_id, survey_id]
    );
    res.json(update.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//TODO:   update question_type
app.put("/update_question_type/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const {question_id, type} = req.body;
    const update = await pool.query(
      "UPDATE question SET type = $1 WHERE id = $2 AND survey_id = $3 RETURNING type",
      [type, question_id, survey_id]
    );
    res.json(update.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// publish survey
app.put("/publish_survey/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const {number_of_questions} = req.body;
    const update = await pool.query(
      "UPDATE survey SET published = true, number_of_questions = $1 WHERE id = $2",
      [number_of_questions, survey_id]
    );
    res.json("survey published!");
  } catch (err) {
    console.error(err.message);
  }
});

// update survey_title
app.put("/update_survey_title/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const {title} = req.body;
    const update = await pool.query(
      "UPDATE survey SET title = $1 WHERE id = $2 RETURNING title",
      [title, survey_id]
    );
    res.json("survey title updated!");
  } catch (err) {
    console.error(err.message);
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
    console.error(err.message);
  }
});

// delete survey
app.delete("/delete_survey/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const deletion = await pool.query("DELETE FROM survey WHERE id = $1", [
      survey_id,
    ]);
    res.json(`survey deleted!`);
  } catch (err) {
    console.error(err.message);
  }
});

// ** --DELETING A QUESTION-- **

// delete question when removing a question
app.delete("/delete_question/:question_id", async (req, res) => {
  try {
    const {question_id} = req.params;
    const deletion = await pool.query(
      "DELETE FROM question WHERE id = $1 RETURNING id",
      [question_id]
    );
    res.json(deletion.rows[0]);
  } catch (err) {
    console.error(err.message, "deleting survey");
  }
});

// update question index based on survey_id after removing the question
app.put("/update_question_index/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const {question_id, question_index} = req.body;
    const update = await pool.query(
      "UPDATE question SET index = index - 1 WHERE survey_id = $1 AND id = $2 AND index = $3 RETURNING index",
      [survey_id, question_id, question_index]
    );
    res.json(update.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// remove all answers for question id when removing a question
app.delete("/delete_answers/:question_id", async (req, res) => {
  try {
    const {question_id} = req.params;
    const deletion = await pool.query(
      "DELETE FROM answer_choice WHERE question_id = $1",
      [question_id]
    );
    res.json("answer choices deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

// ** --END OF DELETING A QUESTION-- **

// ** EDIT ANSWER CHOICE **
// add blank answer choice to survey
app.post("/add_answer_choice/:question_id", async (req, res) => {
  try {
    const {question_id} = req.params;
    const {index, choice} = req.body;
    const answer_choice = await pool.query(
      "INSERT INTO answer_choice (choice, index, question_id) VALUES($1, $2, $3) RETURNING id, question_id, choice, index",
      [choice, index, question_id]
    );
    res.json(answer_choice.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
// update index
app.put("/update_answer_index/:question_id", async (req, res) => {
  try {
    const {question_id} = req.params;
    const {answer_index, answer_id} = req.body;
    const update = await pool.query(
      "UPDATE answer_choice SET index = index - 1 WHERE id =  $1 AND question_id = $2 AND index = $3 RETURNING index",
      [answer_id, question_id, answer_index]
    );
    res.json(update.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
// update text for answer
app.put("/update_answer_choice/:question_id", async (req, res) => {
  try {
    const {question_id} = req.params;
    const {answer_id, choice} = req.body;
    const update = await pool.query(
      "UPDATE answer_choice SET choice = $1 WHERE id = $2 AND question_id = $3 RETURNING choice",
      [choice, answer_id, question_id]
    );
    res.json(update.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// ** REMOVE ANSWER CHOICE **
app.delete("/delete_answer_choice/:answer_id", async (req, res) => {
  try {
    const {answer_id} = req.params;
    const deletion = await pool.query(
      "DELETE FROM answer_choice WHERE id = $1 RETURNING id",
      [answer_id]
    );
    res.json(deletion.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// ** END OF REMOVING ANSWER CHOICE **

// update other answer indices

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
