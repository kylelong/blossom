require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? "production.env"
      : "development.env",
});

const express = require("express");
const config = require("./config");
// const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});
const corsOptions = {
  credentials: true,
  origin:
    process.env.NODE_ENV === "production"
      ? "https://blossomsurveys.io"
      : "http://localhost:3000",
};
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(cors(corsOptions));
// app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("BLOSSOM is on: " + process.env.NODE_ENV);
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
app.post("/create-subscription", async (req, res) => {
  const {email, priceId, paymentMethod} = req.body;

  // create user
  const customer = await stripe.customers.create({
    email: email,
    payment_method: paymentMethod,
    invoice_settings: {
      default_payment_method: paymentMethod,
    },
  });

  // create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{price: priceId}],
    payment_settings: {
      payment_method_options: {
        card: {
          request_three_d_secure: "any",
        },
      },
      payment_method_types: ["card"],
      save_default_payment_method: "on_subscription",
    },
    expand: ["latest_invoice.payment_intent"],
  });
  res.send({
    clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    subscriptionId: subscription.id,
  });
});
app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: 2500,
      automatic_payment_methods: {enabled: true},
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

// USER AUTH
// only inset into users if no user has the email
app.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    const response = await pool.query(
      "SELECT id, (password = crypt($1, password)) AS verified FROM users WHERE email = $2",
      [password, email]
    );
    if (response.error) {
      console.log(response.error);
    }

    let {verified, id} = response.rows[0];
    if (verified) {
      const options = {
        expiresIn: "1h",
      };
      const token = jwt.sign(
        {user_id: id},
        process.env.SECRET_ACCESS_TOKEN,
        options
      );
      res.cookie("token", token, {
        maxAge: 3600000 * 24,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      });
      res.json(response.rows[0]);
    } else {
      return res.status(401).json({message: "Invalid credentials"});
    }
  } catch (err) {
    console.error(err.message);
  }
});
app.post("/logout", async (req, res) => {
  try {
    // TODO: do something with jwt
    res.send({data: "logout"});
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/verify_user/:email/:password", async (req, res) => {
  try {
    const {email, password} = req.params;
    const response = await pool.query(
      "SELECT (password = crypt($1, password)) AS verified FROM users WHERE email = $2",
      [password, email]
    );
    res.json(response.rows[0].verified);
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/user_info/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const response = await pool.query(
      "SELECT id, company, email FROM users WHERE id = $1",
      [user_id]
    );
    res.json(response.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/email_exists/:email", async (req, res) => {
  try {
    const {email} = req.params;
    const response = await pool.query(
      "SELECT COUNT(*) FROM users WHERE email = $1",
      [email]
    );
    res.json(response.rows[0]).count;
  } catch (err) {
    console.error(err.message);
  }
});
// TODO: insert hash from firebase
app.post("/create_user", async (req, res) => {
  try {
    const {email, password, hash} = req.body;
    const response = await pool.query(
      "INSERT INTO users (email, password, hash) VALUES($1, crypt($2, gen_salt('bf')), $3) RETURNING id",
      [email, password, hash]
    );
    res.json(response.rows[0].id);
  } catch (err) {
    console.error(err.message);
  }
});

// update company
app.put("/update_company", async (req, res) => {
  try {
    const {company, id} = req.body;
    const response = await pool.query(
      "UPDATE users SET company = $1 WHERE id = $2 RETURNING company",
      [company, id]
    );
    res.json(response.rows[0].company);
  } catch (err) {
    console.error(err.message);
  }
});
app.put("/update_hash", async (req, res) => {
  try {
    const {hash} = req.body;
    await pool.query("UPDATE users SET hash = $1 WHERE id = $2", [hash, id]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/confirm_user", async (req, res) => {
  try {
    const {user_id} = req.body;
    await pool.query("UPDATE users SET confirmed = true WHERE id = $1", [
      user_id,
    ]);
  } catch (err) {
    console.error(err.message);
  }
});

// TODO: confirm user when they confirm email

// DASHBOARD

// check if this user email and password matches on login

// # of surveys a user has created
app.get("/survey_count/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    // console.log(req.session, req.sessionID);
    const count = await pool.query(
      "SELECT COUNT(*) FROM survey WHERE user_id = $1",
      [user_id]
    );
    res.json(count.rows[0].count);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/published_survey_count/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const count = await pool.query(
      "SELECT COUNT(*) FROM survey WHERE user_id = $1 AND published = true",
      [user_id]
    );
    res.json(count.rows[0].count);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/draft_survey_count/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const count = await pool.query(
      "SELECT COUNT(*) FROM survey WHERE user_id = $1 AND published = false",
      [user_id]
    );
    res.json(count.rows[0].count);
  } catch (err) {
    console.error(err.message);
  }
});

// # of questions a user has created
app.get("/question_count/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const count = await pool.query(
      "SELECT SUM(number_of_questions) FROM survey WHERE user_id = $1 AND published = true",
      [user_id]
    );
    res.json(count.rows[0].sum);
  } catch (err) {
    console.error(err.message);
  }
});

/* question type breakdown
exampe response 
[
    {
        "type": "multi_select",
        "count": "3"
    },
    {
        "type": "single_select",
        "count": "4"
    },
    {
        "type": "open_ended",
        "count": "3"
    },
    {
        "type": "emoji_sentiment",
        "count": "3"
    }
]
*/
app.get("/question_type_count/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const counts = await pool.query(
      "SELECT q.type, COUNT(q.type) FROM question q INNER JOIN survey s ON s.id = q.survey_id WHERE s.user_id = $1 GROUP BY type",
      [user_id]
    );
    res.json(counts.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// number of responses
app.get("/number_of_responses/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const count = await pool.query(
      "SELECT COUNT(*) FROM response r INNER JOIN question q ON r.question_id = q.id INNER JOIN survey s ON s.id = q.survey_id WHERE s.user_id = $1",
      [user_id]
    );
    res.json(count.rows[0].count);
  } catch (err) {
    console.error(err.message);
  }
});

// ** CREATE **
app.post("/create_survey", async (req, res) => {
  try {
    const {title, hash, user_id} = req.body;
    const survey = await pool.query(
      "INSERT INTO survey (title, hash, user_id) VALUES($1, $2, $3) RETURNING title, id, hash, published, redirect_url",
      [title, hash, user_id]
    );
    res.json(survey.rows[0]);
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
    const {survey_id, index, hash} = req.body;
    const question = await pool.query(
      "INSERT INTO question (survey_id, index, hash) VALUES($1, $2, $3) RETURNING id, index, hash",
      [survey_id, index, hash]
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
    await pool.query("DELETE FROM survey WHERE id = $1", [survey_id]);
    res.json("survey deleted!!");
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
    const {index, choice, hash} = req.body;
    const answer_choice = await pool.query(
      "INSERT INTO answer_choice (choice, index, question_id, hash) VALUES($1, $2, $3, $4) RETURNING id, question_id, choice, index, hash",
      [choice, index, question_id, hash]
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
      "SELECT title, id, hash, published, redirect_url, number_of_questions FROM survey WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/published_surveys/:user_id", async (req, res) => {
  try {
    const {user_id} = req.params;
    const titles = await pool.query(
      "SELECT title, id, hash, published, redirect_url, number_of_questions FROM survey WHERE user_id = $1 AND published = true ORDER BY created_at DESC",
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
      "SELECT id, title, type, index, hash FROM question WHERE survey_id = $1 ORDER BY index ASC",
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
      "SELECT choice, id, hash, index FROM answer_choice WHERE question_id = $1 ORDER BY index ASC",
      [question_id]
    );
    res.json(answers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// TAKING SURVEY
app.get("/survey/:hash", async (req, res) => {
  try {
    const {hash} = req.params;
    const titles = await pool.query(
      "SELECT title, id, hash, redirect_url FROM survey WHERE hash = $1 AND published = true",
      [hash]
    );
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// ** RESPONSES **
/**
 * index 1 for question hash
 * {
    "question_hash": "IhBQJ0109JRDXUAj",
    "answers": [
        {
            "hash": "QzV2NxfpfdBS1ryyvtnbPZ1z",
            "answer": ""
        },
        {
            "hash": "GOJapmeoSDhuBdqqp9dmXwqT",
            "answer": ""
        },
        {
            "hash": "7rLVJnpRJh7bQzlSdRPnCjkY",
            "answer": ""
        },
        {
            "hash": "I18NVx9jM49syAQbt6uTQc1c",
            "answer": ""
        }
    ]
}
 */

// get id from question hash
app.get("/get_question_id/:hash", async (req, res) => {
  try {
    const {hash} = req.params;
    const response = await pool.query(
      "SELECT id FROM question WHERE hash = $1",
      [hash]
    );
    res.json(response.rows[0].id);
  } catch (err) {
    console.error(err.message);
  }
});

// get id from answer_choice hash
app.get("/get_answer_choice_id/:hash", async (req, res) => {
  try {
    const {hash} = req.params;
    const response = await pool.query(
      "SELECT id FROM answer_choice WHERE hash = $1",
      [hash]
    );
    res.json(response.rows[0].id);
  } catch (err) {
    console.error(err.message);
  }
});

// ** insert into responses **

// insert for emoji / open_ended question (no answer_id, answer is text) with created_at
app.post("/add_response_with_answer", async (req, res) => {
  try {
    const {answer, question_id} = req.body;
    await pool.query(
      "INSERT INTO response (question_id, answer) VALUES($1, $2)",
      [question_id, answer]
    );
    res.json("answer response inserted");
  } catch (err) {
    console.error(err.message);
  }
});

// insert for multi_select / single_select question (answer_id, answer is null) with created_at
app.post("/add_response_with_answer_id", async (req, res) => {
  try {
    const {answer_id, question_id} = req.body;
    await pool.query(
      "INSERT INTO response (question_id, answer_id) VALUES($1, $2)",
      [question_id, answer_id]
    );
    res.json("answer choice with id response inserted");
  } catch (err) {
    console.error(err.message);
  }
});

// ANALYTICS
// multi_select / single_select
app.get("/answer_choice_analytics/:question_id", async (req, res) => {
  try {
    const {question_id} = req.params;
    const response = await pool.query(
      "SELECT ac.choice, COUNT(ac.choice) AS count, SUM(COUNT(ac.choice)) OVER() as total,COUNT(ac.choice) / SUM(COUNT(ac.choice)) OVER() AS avg  FROM answer_choice ac INNER JOIN response r ON r.answer_id = ac.id WHERE r.question_id = $1 GROUP BY choice",
      [question_id]
    );
    res.json(response.rows); // choice, count, total, avg
  } catch (err) {
    console.error(err.message);
  }
});

// open_ended
app.get("/open_ended_analytics/:question_id", async (req, res) => {
  try {
    const {question_id} = req.params;
    const response = await pool.query(
      "SELECT answer FROM response r INNER JOIN question q ON r.question_id = q.id WHERE r.question_id = $1",
      [question_id]
    );
    res.json(response.rows); //.answer
  } catch (err) {
    res.json(response.rows);
  }
});

app.get("/emoji_analytics/:question_id", async (req, res) => {
  try {
    const {question_id} = req.params;
    const response = await pool.query(
      "SELECT answer, COUNT(answer) AS count, SUM(COUNT(answer)) OVER() as total,COUNT(answer) / SUM(COUNT(answer)) OVER() AS avg  FROM response r INNER JOIN question q ON r.question_id = q.id WHERE r.question_id = $1 GROUP BY answer",
      [question_id]
    );
    res.json(response.rows); // choice, count, total, avg
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(config.PORT, () => {
  console.log(`server listening on port http://${config.HOST}:${config.PORT}`);
});
