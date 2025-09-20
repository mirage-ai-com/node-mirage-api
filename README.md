# node-mirage-api

[![Test and Build](https://github.com/mirage-ai-com/node-mirage-api/workflows/Test%20and%20Build/badge.svg?branch=master)](https://github.com/mirage-ai-com/node-mirage-api/actions?query=workflow%3A%22Test+and+Build%22) [![Build and Release](https://github.com/mirage-ai-com/node-mirage-api/workflows/Build%20and%20Release/badge.svg)](https://github.com/mirage-ai-com/node-mirage-api/actions?query=workflow%3A%22Build+and+Release%22) [![NPM](https://img.shields.io/npm/v/mirage-api.svg)](https://www.npmjs.com/package/mirage-api) [![Downloads](https://img.shields.io/npm/dt/mirage-api.svg)](https://www.npmjs.com/package/mirage-api)

The Mirage API NodeJS wrapper. Access AI inference services.

Copyright 2023 Crisp IM SAS. See LICENSE for copying information.

* **📝 Implements**: [API Reference (V1)](https://docs.mirage-ai.com/references/api/v1/) at revision: 20/09/2025
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
    type : "audio/webm",
    url  : "https://files.mirage-ai.com/dash/terminal/samples/transcribe-speech/hey-there.weba"
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

This library implements all methods the Mirage API provides. See the [API docs](https://docs.mirage-ai.com/references/api/v1/) for a reference of available methods, as well as how returned data is formatted.

### Task API

#### ➡️ Transcribe Speech

* **Method:** `client.Task.TranscribeSpeech(data, { trace?, stream? })`
* **Reference:** [Transcribe Speech](https://docs.mirage-ai.com/references/api/v1/#transcribe-speech)

* **Request:**

```javascript
client.Task.TranscribeSpeech(
  {
    "locale": {
      "to": "en"
    },

    "media": {
      "type": "audio/webm",
      "url": "https://files.mirage-ai.com/dash/terminal/samples/transcribe-speech/hey-there.weba"
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
event: system
data: [START]

event: locale
data: "en"

event: part
data: {"start": 5.0, "end": 9.0, "text": " I'm just speaking some seconds to see if the translation is correct"}

event: system
data: [DONE]
```

#### ➡️ Answer Prompt

* **Method:** `client.Task.AnswerPrompt(data, { trace? })`
* **Reference:** [Answer Prompt](https://docs.mirage-ai.com/references/api/v1/#answer-prompt)

* **Request:**

```javascript
client.Task.AnswerPrompt({
  "prompt": "Generate an article about Alpacas"
});
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "answer": "The alpaca (Lama pacos) is a species of South American camelid mammal. It is similar to, and often confused with, the llama. However, alpacas are often noticeably smaller than llamas. The two animals are closely related and can successfully crossbreed. Both species are believed to have been domesticated from their wild relatives, the vicuña and guanaco. There are two breeds of alpaca: the Suri alpaca and the Huacaya alpaca."
  }
}
```

#### ➡️ Answer Question

* **Method:** `client.Task.AnswerQuestion(data, { trace?, stream? })`
* **Reference:** [Answer Question](https://docs.mirage-ai.com/references/api/v1/#answer-question)

* **Request:**

```javascript
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
    stream : false
  }
);
```

* **Response (data):**

```json
{
  "reason": "processed",

  "data": {
    "answer": "You can add the Crisp chatbox to your website by following this guide: https://help.crisp.chat/en/article/how-to-add-crisp-chatbox-to-your-website-dkrg1d/ :)",
    "sources": []
  }
}
```

* **Response (stream):**

```
event: system
data: [START]

event: model
data: "medium"

event: answer
{"index": 0, "chunk": "You can add the Crisp chatbox to"}

event: answer
{"index": 1, "chunk": " your website by following this guide:"}

event: answer
{"index": 2, "chunk": " https://help.crisp.chat/en/article/how-to-add-crisp-chatbox-to-your-website-dkrg1d/"}

event: answer
{"index": 3, "chunk": " :)"}

event: answer
{"index": 4, "chunk": ""}

event: system
data: [DONE]
```

#### ➡️ Answer Chat

* **Method:** `client.Task.AnswerChat(data, { trace?, stream? })`
* **Reference:** [Answer Chat](https://docs.mirage-ai.com/references/api/v1/#answer-chat)

* **Request:**

```javascript
client.Task.AnswerChat(
  {
    "context": {
      "conversation": {
        "messages": [
          {
            "from": "user",
            "text": "Where is my order?"
          }
        ]
      }
    },

    "tools": [
      {
        "type": "function",

        "function": {
          "name": "get-order-details",
          "description": "Retrieves a user order details.",

          "parameters": {
            "type": "object",

            "properties": {
              "email": {
                "type": "string",
                "description": "customer email"
              },

              "order_number": {
                "type": "string",
                "description": "an order number"
              }
            },

            "required": [
              "email",
              "order_number"
            ]
          }
        }
      }
    ],

    "model": "medium"
  },

  {
    stream: false
  }
);
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "answer": "Sure! What is your email and order number?",
    "model": "medium"
  }
}
```

#### ➡️ Summarize Paragraphs

* **Method:** `client.Task.SummarizeParagraphs(data, { trace? })`
* **Reference:** [Summarize Paragraphs](https://docs.mirage-ai.com/references/api/v1/#summarize-paragraphs)

* **Request:**

```javascript
client.Task.SummarizeParagraphs({
  "paragraphs": [
    {
      "text": "GPT-4 is getting worse over time, not better."
    },

    {
      "text": "Many people have reported noticing a significant degradation in the quality of the model responses, but so far, it was all anecdotal."
    }
  ]
});
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "summary": "GPT-4 is getting worse over time, not better. We have a new version of GPT-4 that is not improving, but it is regressing."
  }
}
```

#### ➡️ Summarize Conversation

* **Method:** `client.Task.SummarizeConversation(data, { trace? })`
* **Reference:** [Summarize Conversation](https://docs.mirage-ai.com/references/api/v1/#summarize-conversation)

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

#### ➡️ Categorize Conversations

* **Method:** `client.Task.CategorizeConversations(data, { trace? })`
* **Reference:** [Categorize Conversations](https://docs.mirage-ai.com/references/api/v1/#categorize-conversations)

* **Request:**

```javascript
client.Task.CategorizeConversations({
  "conversations": [
    {
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
    }
  ]
});
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "categories": [
      "Chatbot Configuration Issue"
    ]
  }
}
```

#### ➡️ Categorize Question

* **Method:** `client.Task.CategorizeQuestion(data, { trace? })`
* **Reference:** [Categorize Question](https://docs.mirage-ai.com/references/api/v1/#categorize-question)

* **Request:**

```javascript
client.Task.CategorizeQuestion({
  "question": "Hello. I have a question."
});
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "category": "opener"
  }
}
```

#### ➡️ Rank Question

* **Method:** `client.Task.RankQuestion(data, { trace? })`
* **Reference:** [Rank Question](https://docs.mirage-ai.com/references/api/v1/#rank-question)

* **Request:**

```javascript
client.Task.RankQuestion({
  "question": "Hi! I am having issues setting up DNS records for my Crisp helpdesk. Can you help?",

  "context": {
    "source": "helpdesk",
    "primary_id": "cf4ccdb5-df44-4668-a9e7-3ab31bebf89b"
  }
});
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "results": [
      {
        "id": "15fd3f24-56c8-435e-af8e-c47d4cd6115c",
        "score": 9,
        "grouped_text": "Setup your Helpdesk domain name\ntutorials for most providers",

        "items": [
          {
            "source": "helpdesk",
            "primary_id": "51a32e4c-1cb5-47c9-bcc0-3e06f0dce90a",
            "secondary_id": "15fd3f24-56c8-435e-af8e-c47d4cd6115c",
            "text": "Setup your Helpdesk domain name\ntutorials for most providers",
            "timestamp": 1682002198552,

            "metadata": {
              "title": "Setup your Helpdesk domain name"
            }
          }
        ]
      }
    ]
  }
}
```

#### ➡️ Translate Text

* **Method:** `client.Task.TranslateText(data, { trace? })`
* **Reference:** [Translate Text](https://docs.mirage-ai.com/references/api/v1/#translate-text)

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

#### ➡️ Fraud Spamicity

* **Method:** `client.Task.FraudSpamicity(data, { trace? })`
* **Reference:** [Fraud Spamicity](https://docs.mirage-ai.com/references/api/v1/#fraud-spamicity)

* **Request:**

```javascript
client.Task.FraudSpamicity({
  "name": "Crisp",
  "domain": "crisp.chat",
  "email_domain": "mail.crisp.chat"
});
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "fraud": false,
    "score": 0.13
  }
}
```

#### ➡️ Spam Conversation

* **Method:** `client.Task.SpamConversation(data, { trace? })`
* **Reference:** [Spam Conversation](https://docs.mirage-ai.com/references/api/v1/#spam-conversation)

* **Request:**

```javascript
client.Task.SpamConversation({
  "sender": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  
  "transcript": [
    {
      "from": "customer",
      "origin": "chat",
      "text": "Hello, I would like to discuss your services"
    }
  ]
});
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "class": "spam",
    "confidence": 0.93,
    "logprob": -0.10,

    "scores": {
      "gibberish": 0.0,
      "marketing": 0.45,
      "regular": 0.0,
      "spam": 0.93
    }
  }
}
```

#### ➡️ Spam Document

* **Method:** `client.Task.SpamDocument(data, { trace? })`
* **Reference:** [Spam Document](https://docs.mirage-ai.com/references/api/v1/#spam-document)

* **Request:**

```javascript
client.Task.SpamDocument({
  "name": "Spammy Domain",
  "domain": "spammy-domain.crisp.help",
  "title": "Spammy title",
  "content": "Spammy content"
});
```

* **Response:**

```json
{
  "reason": "processed",

  "data": {
    "class": "spam",
    "confidence": 0.82,
    "logprob": -0.10,

    "scores": {
      "gibberish": null,
      "marketing": null,
      "regular": 0.0,
      "spam": 0.82
    }
  }
}
```

### Data API

#### ➡️ Context Ingest

* **Method:** `client.Data.ContextIngest(data, { trace? })`
* **Reference:** [Ingest Context Data](https://docs.mirage-ai.com/references/api/v1/#ingest-context-data)

* **Request:**

```javascript
client.Data.ContextIngest({
  "items": [
    {
      "operation": "index",
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
