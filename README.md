# node-mirage-api

[![Test and Build](https://github.com/mirage-ai-com/node-mirage-api/workflows/Test%20and%20Build/badge.svg?branch=master)](https://github.com/mirage-ai-com/node-mirage-api/actions?query=workflow%3A%22Test+and+Build%22) [![Build and Release](https://github.com/mirage-ai-com/node-mirage-api/workflows/Build%20and%20Release/badge.svg)](https://github.com/mirage-ai-com/node-mirage-api/actions?query=workflow%3A%22Build+and+Release%22) [![NPM](https://img.shields.io/npm/v/mirage-api.svg)](https://www.npmjs.com/package/mirage-api) [![Downloads](https://img.shields.io/npm/dt/mirage-api.svg)](https://www.npmjs.com/package/mirage-api)

The Mirage API NodeJS wrapper. Access AI inference services.

Copyright 2023 Crisp IM SAS. See LICENSE for copying information.

* **😘 Maintainer**: [@valeriansaliou](https://github.com/valeriansaliou)

## Usage

Install the library:

```bash
npm install mirage-api --save
```

Then, import it:

```javascript
var Mirage = require("mirage-api").Mirage;
```

Construct a new authenticated Mirage client with your `user_id` and `secret_key` tokens.

```javascript
var client = new Mirage("ui_xxxxxx", "sk_xxxxxx");
```

Then, consume the client eg. to transcribe a audio file containing speech to text:

```javascript
client.Task.TranscribeSpeech({
  locale : {
    from : "en",
    to   : "en"
  },

  media : {
    type : "audio/mp3",
    url  : "https://storage.crisp.chat/users/upload/session/5acfdb5400c15c00/audio1681224631050_9elgef.mp3"
  }
})
  .then(function(data) {
    console.info("Transcribed audio:", data);
  })
  .catch(function(error) {
    console.error("Failed transcribing audio:", error);
  });
```

## Authentication

To authenticate against the API, get your tokens (`user_id` and `secret_key`).

Then, pass those tokens **once** when you instanciate the Mirage client as following:

```javascript
// Make sure to replace 'user_id' and 'secret_key' with your tokens
var client = new Mirage("user_id", "secret_key");
```

## Resource Methods

This library implements all methods the Mirage API provides.

### Task API

#### Transcribe Speech

* **Method:** `client.Task.TranscribeSpeech(data)`

```javascript
client.Task.TranscribeSpeech({
  "locale": {
    "from": "en",
    "to": "en"
  },

  "media": {
    "type": "audio/mp3",
    "url": "https://storage.crisp.chat/users/upload/session/5acfdb5400c15c00/audio1681224631050_9elgef.mp3"
  }
});
```

#### Answer Question

* **Method:** `client.Task.AnswerQuestion(data)`

```javascript
client.Task.AnswerQuestion({
  "question": "How can I setup the Crisp chatbox?",

  "context": {
    "team": "Crisp",

    "transcripts": [
      {
        "messages": [
          {
            "from": "customer",
            "text": "Hi, does the \"per website\" pricing include sub-domains?"
          },

          {
            "from": "agent",
            "text": "Hi, yes, it includes sub-domains"
          },

          {
            "from": "customer",
            "text": "Perfect thanks!"
          }
        ]
      }
    ]
  }
});
```

#### Summarize Conversation

* **Method:** `client.Task.SummarizeConversation(data)`

```javascript
client.Task.SummarizeConversation({
  "transcript": [
    {
      "name": "Valerian",
      "text": "Hello! I have a question about the Crisp chatbot, I am trying to setup a week-end auto-responder, how can I do that?"
    },

    {
      "name": "Baptiste",
      "text": "Hi. Baptiste here. I can provide you an example bot scenario that does just that if you'd like?"
    }
  ]
});
```

#### Categorize Conversation

* **Method:** `client.Task.CategorizeConversation(data)`

```javascript
client.Task.CategorizeConversation({
  "transcript": [
    {
      "from": "customer",
      "text": "Hello! I have a question about the Crisp chatbot, I am trying to setup a week-end auto-responder, how can I do that?"
    },

    {
      "from": "agent",
      "text": "Hi. Baptiste here. I can provide you an example bot scenario that does just that if you'd like?"
    }
  ]
});
```

#### Translate Text

* **Method:** `client.Task.TranslateText(data)`

```javascript
client.Task.TranslateText({
  "locale": {
    "from": "fr",
    "to": "en"
  },

  "text": "Bonjour, comment puis-je vous aider ?"
});
```
