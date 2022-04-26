const EventEmitter = require('events');
/** @type {EventEmitter} */
const eventEmitter = new EventEmitter()
const commTest = require('./commonTest')

var ob = {
    "propa": "A filename",
    "propb": true
};

eventEmitter.on('topic1', (some)=>{
    console.log("received");
});

eventEmitter.on('topic1', commTest.onTopic);

eventEmitter.emit('topic1', ob);