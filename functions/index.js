const functions = require("firebase-functions");

const bodyParser = require("body-parser");
const express = require("express");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();
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
