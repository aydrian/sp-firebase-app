'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const animals = [
  {name: 'dog', emoji: '🐶'},
  {name: 'cat', emoji: '🐱'},
  {name: 'mouse', emoji: '🐭'},
  {name: 'hamster', emoji: '🐹'},
  {name: 'bunny', emoji: '🐰'},
  {name: 'bear', emoji: '🐻'},
  {name: 'panda', emoji: '🐼'},
  {name: 'koala', emoji: '🐨'},
  {name: 'tiger', emoji: '🐯'},
  {name: 'lion', emoji: '🦁'},
  {name: 'cow', emoji: '🐮'},
  {name: 'pig', emoji: '🐷'},
  {name: 'frog', emoji: '🐸'},
  {name: 'octopus', emoji: '🐙'},
  {name: 'monkey', emoji: '🐵'},
  {name: 'chicken', emoji: '🐔'},
  {name: 'penguin', emoji: '🐧'},
  {name: 'pigeon', emoji: '🐦'},
  {name: 'wolf', emoji: '🐺'},
  {name: 'boar', emoji: '🐗'},
  {name: 'horse', emoji: '🐴'},
  {name: 'unicorn', emoji: '🦄'}
];

const escapeEmailAddress = (email) => {
  if (!email) return false

  // Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
  email = email.toLowerCase();
  email = email.replace(/\./g, ',');
  return email;
}

const getRandomAnimal = () => {
  return animals[Math.floor(Math.random() * (animals.length + 1))];
}

exports.incoming = functions.https.onRequest((req, res) => {
  if (req.method != "POST") {
     res.status(404).send();
     return;
  }

  const batch = req.body;
  for (let i = 0; i < batch.length; i++) {
    // For this application, we can safely assume the batch will only
    // contain relay_message events
    const msg = batch[i].msys.relay_message;
    let player = {
      email: msg.friendly_from || msg.msg_from,
      to: msg.rcpt_to,
      subject: msg.content.subject,
      body: msg.content.text || msg.content.html,
      animal: getRandomAnimal()
    }
    admin.database().ref(`/players/${escapeEmailAddress(player.email)}`).set(player);
  }
  res.status(200).send();
});
