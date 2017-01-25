const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

var garageState = ''
var connected = false

// Controller subscribes to topics it wants to hear messages from
client.on('connect', () => {
  client.subscribe('garage/connected')
  client.subscribe('garage/state')
})

// On receiving a message, the controller calls the following calls:
client.on('message', (topic, message) => {
  switch (topic) {
    case 'garage/connected':
      return handleGarageConnected(message)
    case 'garage/state':
      return handleGarageState(message)
  }
  console.log('No handler for topic %s', topic)
})

function handleGarageConnected(message) {
  console.log('garage connected status %s', message)
  connected = (message.toString() === 'true')
}

function handleGarageState(message) {
  garageState = message
  console.log('garage state update to %s', message)
}

function openGarageDoor() {
  // Can only open the door if connected to mqtt and door isn't already open
  if (connected && garageState !== 'open') {
    // Ask the door to open
    client.publish('garage/open', 'true')
  }
}

function closeGarageDoor() {
  // Can only close the door if connected to mqtt and door isn't already closed
  if (connected && garageState !== 'closed') {
    // Ask the door to close
    client.publish('garage/close', 'true')
  }
}

// --- For Demonstration Purposes Only --- //

// Simulate opening the door
setTimeout(() => {
  console.log('open door')
  openGarageDoor()
}, 5000)

// Simulate closing the door
setTimeout(() => {
  console.log('close door')
  closeGarageDoor()
}, 20000)
