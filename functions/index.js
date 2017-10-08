'use strict'

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const SparkPost = require('sparkpost')
const spClient = new SparkPost(functions.config().sparkpost.api_key)

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
]

const escapeEmailAddress = (email) => {
  if (!email) return false

  // Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
  email = email.toLowerCase()
  email = email.replace(/\./g, ',')
  return email
}

const getRandomAnimal = () => {
  return animals[Math.floor(Math.random() * (animals.length + 1))]
}

exports.incoming = functions.https.onRequest((req, res) => {
  if (req.method != 'POST') {
    res.status(404).send()
    return
  }

  const batch = req.body
  const batchLen = batch.length
  for (let i = 0; i < batchLen; i++) {
    // For this application, we can safely assume the batch will only
    // contain relay_message events
    const msg = batch[i].msys.relay_message
    let player = {
      email: msg.friendly_from || msg.msg_from,
      to: msg.rcpt_to,
      subject: msg.content.subject,
      body: msg.content.text || msg.content.html,
      animal: getRandomAnimal()
    }
    admin.database().ref(`/players/${escapeEmailAddress(player.email)}`).set(player)
    spClient.transmissions.send({
      campaign_id: 'sparkpost-zoo',
      content: {
        template_id: 'sparkpost-zoo'
      },
      recipients: [{
        address: { email: player.email, name: player.subject },
        substitution_data: player
      }]
    })
  }
  res.status(200).send()
})

const processMessageEvent = (event) => {
  if (event.campaign_id !== 'sparkpost-zoo') { return }
  if (event.type !== 'delivery') { return }
  console.log('Delivery Event')
  admin.database().ref(`/players/${escapeEmailAddress(event.rcpt_to)}`).update({
    delivered: event.timestamp
  })
}

const processTrackEvent = (event) => {
  if (event.campaign_id !== 'sparkpost-zoo') { return }
  if (event.type === 'open') {
    console.log('Open Event')
    admin.database().ref(`/players/${escapeEmailAddress(event.rcpt_to)}/opens`).push({
      timestamp: event.timestamp,
      user_agent: event.user_agent,
      geo_ip: event.geo_ip
    })
  } else if (event.type === 'click') {
    console.log('Click Event')
    admin.database().ref(`/players/${escapeEmailAddress(event.rcpt_to)}/clicks`).push({
      timestamp: event.timestamp,
      user_agent: event.user_agent,
      geo_ip: event.geo_ip,
      target_link_name: event.target_link_name,
      target_link_url: event.target_link_url
    })
  }
}

exports.incomingEvents = functions.https.onRequest((req, res) => {
  if (req.method != 'POST') {
    res.status(404).send()
    return
  }

  const batch = req.body
  const batchLen = batch.length
  for (let i = 0; i < batchLen; i++) {
    const event = batch[i].msys
    console.log(event)
    if (event && event.message_event) {
      processMessageEvent(event.message_event)
    } else if (event && event.track_event) {
      processTrackEvent(event.track_event)
    }
  }

  res.status(200).send()
})
