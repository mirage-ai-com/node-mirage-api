/*
 * node-mirage-api
 *
 * Copyright 2023, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


// Notice: use 'require("mirage-api").Mirage' if installing as a package
var Mirage = require("../").Mirage;


var client = new Mirage(
  "ui_a311da78-6b89-459c-8028-b331efab20d5",
  "sk_f293d44f-675d-4cb1-9c78-52b8a9af0df2"
);


// Notice: using the stream API here
client.Task.AnswerQuestion(
  {
    "question": "Should I pay more for that?",

    "answer": {
      "start": "Sure,"
    },

    "context": {
      "primary_id": "cf4ccdb5-df44-4668-a9e7-3ab31bebf89b",

      "conversation": {
        "messages": [
          {
            "from": "customer",
            "text": "Hey there!"
          },

          {
            "from": "agent",
            "text": "Hi. How can I help?"
          },

          {
            "from": "customer",
            "text": "I want to add more sub-domains to my website."
          }
        ]
      }
    }
  },

  {
    stream : true
  }
)
  .then(function(stream) {
    // Bind all event listeners on created stream
    stream.on("data", function(data) {
      console.log("Got partial data:", data);
    });

    stream.on("error", function(error) {
      console.error("Answering aborted:", error);
    });

    stream.on("done", function() {
      console.info("Done receiving answer!");
    });

    stream.on("end", function() {
      console.info("End of answer stream.");
    });
  })
  .catch(function(error) {
    console.error("Failed creating answer question stream:", error);
  });
