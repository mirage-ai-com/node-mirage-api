# node-mirage-api

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
  // (Data here)
});
```

#### Answer Question

* **Method:** `client.Task.AnswerQuestion(data)`

```javascript
client.Task.AnswerQuestion({
  // (Data here)
});
```
