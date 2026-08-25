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


var parts = [];
var locale = "";


client.Task.TranscribeSpeech({
  locale : {
    to : "en"
  },

  media : {
    type : "audio/webm",

    url  : (
      "https://files.mirage-ai.com"  +
        "/dash/terminal/samples/transcribe-speech/hey-there.weba"
    )
  }
}, {
  stream : true
})
  .then(function(stream) {
    stream.on("locale", function(data) {
      locale = data;

      console.info("Detected locale:", data);
    });

    stream.on("part", function(data) {
      parts.push(data);

      console.info("Transcribed part:", data);
    });

    stream.on("error", function(error) {
      // Stall or disconnect: keep parts already received
      console.warn("Stream interrupted, using truncated transcript:", error);
      console.info("Truncated audio:", {
        locale : locale,
        parts  : parts
      });
    });

    stream.on("done", function() {
      console.info("Transcribed audio:", {
        locale : locale,
        parts  : parts
      });
    });

    stream.on("end", function() {
      console.info("End of transcribe stream.");
    });
  })
  .catch(function(error) {
    console.error("Failed creating transcribe speech stream:", error);
  });
