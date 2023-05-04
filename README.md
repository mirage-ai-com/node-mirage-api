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
    to : "en"
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

#### ➡️ Transcribe Speech

* **Method:** `client.Task.TranscribeSpeech(data, { stream })`

* **Request:**

```javascript
client.Task.TranscribeSpeech(
  {
    "locale": {
      "to": "en"
    },

    "media": {
      "type": "audio/mp3",
      "url": "https://storage.crisp.chat/users/upload/session/5acfdb5400c15c00/audio1681224631050_9elgef.mp3"
    }
  },

  {
    stream : false
  }
);
```

* **Response (data):**

```json
{
  "reason": "processed",

  "data": {
    "locale": "en",

    "parts": [
      {
        "start": 5.0,
        "end": 9.0,
        "text": " I'm just speaking some seconds to see if the translation is correct"
      }
    ]
  }
}
```

* **Response (stream):**

```
{"start": 5.0, "end": 9.0, "text": " I'm just speaking some seconds to see if the translation is correct"}
```

#### ➡️ Answer Question

* **Method:** `client.Task.AnswerQuestion(data, { stream })`

* **Request:**

```javascript
client.Task.AnswerQuestion(
  {
    "question": "Should I pay more for that?",

    "answer": {
      "start": "Sure,"
    },

    "context": {
      "team": {
        "id": "cf4ccdb5-df44-4668-a9e7-3ab31bebf89b",
        "name": "Crisp"
      },

      "transcripts": {
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
        },

        "related": [
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
    }
  },

  {
    stream : false
  }
);
```

* **Response (data):**

```json
{
  "reason": "processed",

  "data": {
    "answer": "You can add the Crisp chatbox to your website by following this guide: https://help.crisp.chat/en/article/how-to-add-crisp-chatbox-to-your-website-dkrg1d/ :)"
  }
}
```

* **Response (stream):**

```
{"index": 0, "chunk": "You can add the Crisp chatbox to"}
{"index": 1, "chunk": " your website by following this guide:"}
{"index": 2, "chunk": " https://help.crisp.chat/en/article/how-to-add-crisp-chatbox-to-your-website-dkrg1d/"}
{"index": 3, "chunk": " :)"}
{"index": 4, "chunk": ""}
```

#### ➡️ Summarize Conversation

* **Method:** `client.Task.SummarizeConversation(data)`

* **Request:**

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

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "summary": "Valerian wants to set up a week-end auto-responder on Crisp chatbot. Baptiste can give him an example."
  }
}
```

#### ➡️ Categorize Conversation

* **Method:** `client.Task.CategorizeConversation(data)`

* **Request:**

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

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "category": "Chatbot Configuration Issue"
  }
}
```

#### ➡️ Translate Text

* **Method:** `client.Task.TranslateText(data)`

* **Request:**

```javascript
client.Task.TranslateText({
  "locale": {
    "from": "fr",
    "to": "en"
  },

  "type": "html",
  "text": "Bonjour, comment puis-je vous aider <span translate=\"no\">Mr Saliou</span> ?"
});
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "translation": "Hi, how can I help you Mr Saliou?"
  }
}
```

### Data API

#### ➡️ Context Ingest

* **Method:** `client.Data.ContextIngest(data)`

* **Request:**

```javascript
client.Data.ContextIngest({
  "items": [
    {
      "primary_id": "pri_cf44dd72-4ba9-4754-8fb3-83c4261243c4",
      "secondary_id": "sec_6693a4a2-e33f-4cce-ba90-b7b5b0922c46",
      "tertiary_id": "ter_de2bd6e7-74e1-440d-9a23-01964cd4b7da",

      "text": "Text to index here...",
      "source": "chat",
      "timestamp": 1682002198552,

      "metadata": {
        "custom_key": "custom_value",
        "another_key": "another_value"
      }
    }
  ]
});
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "imported": true
  }
}
```
