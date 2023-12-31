"use strict";

const token = process.env.WHATSAPP_TOKEN;

const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json());

app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

app.post("/webhook", (req, res) => {
  let body = req.body;

  console.log(JSON.stringify(req.body, null, 2));

  if (req.body.object) {
    // if (
    //   req.body.entry &&
    //   req.body.entry[0].changes &&
    //   req.body.entry[0].changes[0] &&
    //   req.body.entry[0].changes[0].value.messages &&
    //   req.body.entry[0].changes[0].value.messages[0]
    // ) {
      if (req.body.entry[0].changes[0].value.messages || req.body.entry[0].changes[0].value.statuses) {

      var jackrabbit = require('jackrabbit');
      var url = process.env.CLOUDAMQP_URL;
      var rabbit = jackrabbit(url);
      var exchange = rabbit.default();

      var queue = exchange.queue({ name: 'wp-hook', durable: true });

      exchange.publish({ msg: req.body }, { key: 'wp-hook' });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});
