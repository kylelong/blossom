const functions = require("firebase-functions");

const bodyParser = require("body-parser");
const express = require("express");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();
const db = admin.firestore();
const main = express();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
main.use("/api", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("hello kyle");
});

exports.hasUnpublishedSurvey = functions.https.onRequest((data, context) => {
  const uid = "ckltaRESz1WbbqU8eDbSVweOrFY2";
  console.log(context.auth);
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unathenticated",
      "request has invalid credentials"
    );
  }
  const q = db
    .collection("surveys")
    .where("uid", "==", uid)
    .where("published", "==", false)
    .orderBy("createdAt", "desc")
    .limit(1);

  return q
    .get()
    .then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => doc.data());
    })
    .catch((err) => {
      console.log(err);
    });
});

// app.put('/api/updateCompany', async (req, res) => {
//     try {
//         admin.auth().updateUser(req.uid, {
//             "compnay": "Academia"
//         }).t

//     } catch(error){

//     }
// })

// firebase
// const userCollection = "users";
