const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

/**
 * The state of the garage door
 *
 * @default closed
 *
 * Possible states: closed, opening, open, closing
 */

var state = 'closed'

client.on('connect', () => {
  client.subscribe('garage/open')
  client.subscribe('garage/close')


  // Inform the controllers that garage is connected
  client.publish('garage/connected', 'true')
  sendStateUpdate()
})

client.on('message', (topic, message) => {
  console.log('received message %s %s', topic, message)
  switch (topic) {
    case 'garage/open':
      return handleOpenRequest(message)
    case 'garage/close':
      return handleCloseRequest(message)
  }
})

function sendStateUpdate() {
  console.log('sending state %s', state)
  client.publish('garage/state', state)
}

function handleOpenRequest(message) {
  if (state !== 'open' && state !== 'opening') {
    console.log('opening garage door')
    state = 'opening'
    sendStateUpdate()

    // Simulate door open after 5 seconds (would be listening to the hardware)
    setTimeout(() => {
      state = 'open'
      sendStateUpdate()
    }, 5000)
  }
}

function handleCloseRequest(message) {
  if (state !== 'closed' && state !== 'closing') {
    console.log('closing garage door')
    state = 'closing'
    sendStateUpdate()

    // Simulate door close after 5 seconds (would be listening to the hardware)
    setTimeout(() => {
      state = 'closed'
      sendStateUpdate()
    }, 5000)
  }
}

function handleAppExit (options, err) {
  if (err) console.log(err.stack)

  if (options.cleanup) client.publish('garage/connected', 'false')

  if (options.exit) process.exit()
}

// Handles the different ways the application can shut down
process.on('exit', handleAppExit.bind(null, {
  cleanup: true
}))
process.on('SIGINT', handleAppExit.bind(null, {
  exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {
  exit: true
}))
