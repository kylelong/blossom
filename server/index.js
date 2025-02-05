require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? "production.env"
      : "development.env",
});

const express = require("express");
const config = require("./config");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const postmark = require("postmark");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});
const corsOptions = {
  origin: true,
  credentials: true,
  methods: "POST, PUT, GET ,OPTIONS, DELETE",
};
const endpoint =
  process.env.NODE_ENV === "production"
    ? process.env.LIVE_URL
    : process.env.LOCAL_URL;

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "production"
      ? process.env.LIVE_URL
      : process.env.LOCAL_URL
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);

  next();
});

/* 
 [
    "https://blossomsurveys.io",
    "https://www.blossomsurveys.io",
    "http://localhost:3000",
  ]
*/

const authenticate = (req, res, next) => {
  const token = req.cookies.blossom_token;
  if (!token) {
    return res.status(401).json({message: "Unauthorized"});
  }

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({message: "Forbidden"});
    }
    req.user_id = decoded.id;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("BLOSSOM is on: " + process.env.NODE_ENV);
});

app.post("/send_welcome_email", (req, res) => {
  try {
    const client = new postmark.ServerClient(process.env.POSTMARK_KEY);
    const {email, hash} = req.body;

    const url = `${endpoint}/account_management/auth/action?mode=verifyEmail&hash=${hash}`;

    client.sendEmailWithTemplate({
      From: process.env.CONTACT_EMAIL,
      To: email,
      TemplateAlias: "welcome",
      TemplateModel: {
        product_url: "product_url_Value",
        product_name: "Blossom",
        name: "",
        action_url: url, // make this endpoint / what ever
        company_name: "Blossom",
        company_address: process.env.CONTACT_EMAIL,
        login_url: "login_url_Value",
        username: "username_Value",
        trial_length: "trial_length_Value",
        trial_start_date: "trial_start_date_Value",
        trial_end_date: "trial_end_date_Value",
        support_email: "support_email_Value",
        live_chat_url: "live_chat_url_Value",
        sender_name: "sender_name_Value",
        help_url: "help_url_Value",
      },
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
app.post("/create-subscription", async (req, res) => {
  const {email, priceId, paymentMethod} = req.body;

  try {
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
      trial_period_days: 0,
      payment_settings: {
        payment_method_options: {
          card: {
            request_three_d_secure: "automatic",
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
  } catch (err) {
    return res.status(402).json(err);
  }
});
app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: 1900,
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

// FREE TRIAL

/*
- menu: if premium is false after trial date (trial date is positive) show button subscribe to continue using blossom
add subscribed date column to users table

- account: only show form if premium is false and trail period has not passed
- account: once form is successful show thank you by setting state and on refresh so premium user check mark

 get end of trial date - Your 2 week free trial ends in X days on [date]. Subscribe here to continue to use blossom's features.
    select created_at + INTERVAL '2 weeks'  from users where id = ? (auth endpoint)

days from now until end of period, should be negative 
    SELECT
  EXTRACT(DAY FROM (DATE_TRUNC('day', NOW()) - DATE_TRUNC('day', created_at + INTERVAL '2 weeks'))) AS days_since_created
FROM
  users where id = ?
*/
// what shows up on /account instead of the card element

app.get("/trial_info", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
    const response = await pool.query(
      "SELECT premium, EXTRACT(DAY FROM (DATE_TRUNC('day', NOW()) - DATE_TRUNC('day', created_at + INTERVAL '2 weeks'))) AS days_until_trial_ends FROM users where id = $1",
      [user_id]
    );
    const {days_until_trial_ends, premium} = response.rows[0];
    if (premium) {
      res.send({
        msg: "You are a premium member and have access to all of Blossom's features. Thank you 😊",
        access: true,
        premium: premium,
        access: days_until_trial_ends < 0,
      });
    } else {
      if (days_until_trial_ends < 0) {
        // access && !premium
        res.send({
          msg: `${Math.abs(days_until_trial_ends)} trial days remaining`,
          access: true,
          premium: premium,
          access: days_until_trial_ends < 0,
        });
      } else {
        res.send({
          msg: `Your 2 week free trial has ended. Please click here to subscribe to continue using Blossom.`,
          access: false,
          premium: premium,
          access: days_until_trial_ends < 0,
        });
      }
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/upgrade_account", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
    const response = await pool.query(
      "UPDATE users SET premium = true WHERE id = $1 RETURNING premium",
      [user_id]
    );
    res.json({premium: response.rows[0].premium});
  } catch (err) {
    console.error(err.message);
  }
});

// USER AUTH
// only inset into users if no user has the email

app.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    const response = await pool.query(
      "SELECT id, confirmed, premium, (password = crypt($1, password)) AS verified, EXTRACT(DAY FROM (DATE_TRUNC('day', NOW()) - DATE_TRUNC('day', created_at + INTERVAL '2 weeks'))) AS days_until_trial_ends FROM users WHERE email = $2",
      [password, email]
    );
    if (response.error) {
      console.log(response.error);
    }

    let {verified, id, confirmed, premium, days_until_trial_ends} =
      response.rows[0];
    if (verified) {
      const token = jwt.sign({id}, process.env.SECRET_ACCESS_TOKEN); //TODO: expire with refresh token
      res.cookie("blossom_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        domain:
          process.env.NODE_ENV === "production"
            ? ".blossomsurveys.io"
            : "localhost",
      });
      // Set Cache-Control header to no-cache
      res.setHeader("Authorization", "Bearer " + token);

      res.status(200).json({
        loggedIn: true,
        token: token,
        email: email,
        confirmed: confirmed,
        premium: premium,
        access: days_until_trial_ends < 0,
      });
    } else {
      return res.status(401).json({loggedIn: false});
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/validPassword", async (req, res) => {
  try {
    const {email, password} = req.body;
    const response = await pool.query(
      "SELECT id, (password = crypt($1, password)) AS verified FROM users WHERE email = $2",
      [password, email]
    );

    let {verified} = response.rows[0];
    res.json({verified: verified});
  } catch (err) {
    console.error(err.message);
  }
});

// TODO: insert hash from firebase
app.post("/create_user", async (req, res) => {
  try {
    const {email, password, hash} = req.body;
    const response = await pool.query(
      "INSERT INTO users (email, password, hash) VALUES($1, crypt($2, gen_salt('bf')), $3) RETURNING *",
      [email, password, hash]
    );
    const id = response.rows[0].id;
    if (id) {
      const token = jwt.sign({id}, process.env.SECRET_ACCESS_TOKEN); //TODO: expire with refresh token
      res.cookie("blossom_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        domain:
          process.env.NODE_ENV === "production"
            ? ".blossomsurveys.io"
            : "localhost",
      });
      // Set Cache-Control header to no-cache
      res.setHeader("Authorization", "Bearer " + token);

      res.status(200).json({loggedIn: true, token: token, id: id});
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
    req.user_id = null;
    res.clearCookie("blossom_token");
    res
      .status(200)
      .json({loggedIn: false, premium: null, confirmed: null, access: null});
  } catch (err) {
    console.error(err.message);
  }
});
app.put("/update_password", async (req, res) => {});
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
app.get("/user_info", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
    const response = await pool.query(
      "SELECT id, company, email FROM users WHERE id = $1",
      [user_id]
    );
    res.json(response.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/isAuthenticated", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
    const response = await pool.query(
      "SELECT confirmed, premium, EXTRACT(DAY FROM (DATE_TRUNC('day', NOW()) - DATE_TRUNC('day', created_at + INTERVAL '2 weeks'))) AS days_until_trial_ends FROM users WHERE id = $1",
      [user_id]
    );

    let {confirmed, premium, days_until_trial_ends} = response.rows[0];

    if (user_id) {
      res.status(200).json({
        loggedIn: true,
        confirmed: confirmed,
        premium: premium,
        access: days_until_trial_ends < 0,
      });
    } else {
      res.status(401).send({
        loggedIn: false,
        confirmed: confirmed,
        premium: premium,
        access: days_until_trial_ends < 0,
      });
    }
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

// TODO: make it so the email is valid for the hash
app.get("/valid_hash/:hash", async (req, res) => {
  try {
    const {hash} = req.params;
    const response = await pool.query(
      "SELECT COUNT(*) FROM users WHERE hash = $1",
      [hash]
    );
    res.json(response.rows[0]).count;
  } catch (err) {
    console.error(err.message);
  }
});

// update company
app.put("/update_company", authenticate, async (req, res) => {
  try {
    const id = req.user_id;
    const {company} = req.body;
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
    const {hash} = req.body;
    await pool.query("UPDATE users SET confirmed = true WHERE hash = $1", [
      hash,
    ]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
  }
});

// DASHBOARD

// check if this user email and password matches on login

// # of surveys a user has created
app.get("/survey_count", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
    const count = await pool.query(
      "SELECT COUNT(*) FROM survey WHERE user_id = $1",
      [user_id]
    );

    res.json(count.rows[0].count);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/published_survey_count", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
    const count = await pool.query(
      "SELECT COUNT(*) FROM survey WHERE user_id = $1 AND published = true",
      [user_id]
    );
    res.json(count.rows[0].count);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/draft_survey_count", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
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
app.get("/question_count", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
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
app.get("/question_type_count", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
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
app.get("/number_of_responses", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
    const count = await pool.query(
      "SELECT SUM(responses) FROM survey WHERE user_id = $1",
      [user_id]
    );
    res.json(count.rows[0].sum);
  } catch (err) {
    console.error(err.message);
  }
});

// ** CREATE **
app.post("/create_survey", authenticate, async (req, res) => {
  try {
    const {title, hash} = req.body;
    const user_id = req.user_id;
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
app.get("/latest_survey", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
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
    await pool.query(
      "UPDATE survey SET title = $1 WHERE id = $2 RETURNING title",
      [title, survey_id]
    );
    res.json("survey title updated!");
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/update_survey_response_count", async (req, res) => {
  try {
    const {survey_hash} = req.body;
    await pool.query(
      "UPDATE survey SET responses = responses + 1 WHERE hash = $1",
      [survey_hash]
    );
    res.json("survey resposne recorded!");
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
app.get("/surveys", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
    const titles = await pool.query(
      "SELECT title, id, hash, published, redirect_url, number_of_questions FROM survey WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/published_surveys", authenticate, async (req, res) => {
  try {
    const user_id = req.user_id;
    const titles = await pool.query(
      "SELECT title, id, hash, published, redirect_url, number_of_questions, responses FROM survey WHERE user_id = $1 AND published = true ORDER BY created_at DESC",
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

// get choice text from answer id for analytics

app.get("/answer_from_id/:answer_id", async (req, res) => {
  try {
    const {answer_id} = req.params;
    const answer = await pool.query(
      "SELECT choice FROM answer_choice WHERE id = $1",
      [answer_id]
    );
    res.json(answer.rows);
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
    const {answer, question_id, response_hash} = req.body;
    await pool.query(
      "INSERT INTO response (question_id, answer, response_hash) VALUES($1, $2, $3)",
      [question_id, answer, response_hash]
    );
    res.json("answer response inserted");
  } catch (err) {
    console.error(err.message);
  }
});

// insert for multi_select / single_select question (answer_id, answer is null) with created_at
app.post("/add_response_with_answer_id", async (req, res) => {
  try {
    const {answer_id, question_id, response_hash} = req.body;
    await pool.query(
      "INSERT INTO response (question_id, answer_id, response_hash) VALUES($1, $2, $3)",
      [question_id, answer_id, response_hash]
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
      "SELECT answer FROM response r INNER JOIN question q ON r.question_id = q.id WHERE r.question_id = $1 ORDER BY r.created_at DESC",
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

app.get("/response_hashes/:survey_id", async (req, res) => {
  try {
    const {survey_id} = req.params;
    const response = await pool.query(
      "SELECT DISTINCT(r.response_hash) from response r INNER JOIN question q ON q.id = r.question_id WHERE q.survey_id = $1 AND r.response_hash != ''; ",
      [survey_id]
    );
    res.json(response.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/responses_by_hash/:survey_id/:response_hash", async (req, res) => {
  try {
    const {survey_id, response_hash} = req.params;
    const response = await pool.query(
      "SELECT * FROM response r INNER JOIN question q ON q.id = r.question_id WHERE q.survey_id = $1 AND r.response_hash = $2 ORDER BY q.index;",
      [survey_id, response_hash]
    );
    res.json(response.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(config.PORT, () => {
  console.log(`server listening on port http://${config.HOST}:${config.PORT}`);
});
