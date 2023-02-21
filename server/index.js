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

// get all survey titles
app.get("/surveys/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const titles = await pool.query(
      "SELECT title FROM survey WHERE user_id = $1 ORDER BY created_at DESC",
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

app.get("/answers/:question_id", async (req, res) => {
  try {
    const {question_id} = req.params;
    const answers = await pool.query(
      "SELECT choice FROM answer_choice WHERE question_id = $1 ORDER BY index ASC",
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
