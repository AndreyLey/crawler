var amqp = require('amqplib/callback_api');

class RMQueue 
{ 
    constructor() 
    { 
        amqp.connect('amqp://localhost', function(error0, connection) { console.log("Fail to connect to the Rabbit")});
    } 
         
    enqueue(element) 
    {    
         
    } 

    dequeue() 
    { 

    } 

    isEmpty() 
    { 

    } 
}

module.exports.RMQueue = RMQueue;