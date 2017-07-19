'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.incoming = functions.https.onRequest((req, res) => {
  if (req.method != "POST") {
     res.status(404).send();
     return;
  }

  const batch = req.body;
  for (let i = 0; i < batch.length; i++) {
    // For this application, we can safely assume the batch will only
    // contain relay_message events
    admin.database().ref('/raw-inbound').push(batch[i].msys.relay_message);
  }
  res.status(200).send();
});
