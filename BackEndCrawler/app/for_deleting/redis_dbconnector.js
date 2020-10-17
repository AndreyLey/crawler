// const redis_db = require('redis');

// const client = redis_db.createClient(5001,'localhost');

// client.on("error", function(error) {
//     console.error(error);
//   });

const { promisify } = require("util");


// function setDependencies(key,  value)
// {
//     // const getAsync = promisify(client.set).bind(key,value);
//     // getAsync.then(console.log).catch(console.error);
//     client.setex(key,3600,value);
// }

function setDependencies(client, key,  value)
{
    client.setex(key,3600,value);
}

function getDependencies(client, key)
{
    console.log(`Get from redis: ${key}`);

    client.get(key,(error, data)=>
    {
        if(error) console.log(error);
        console.log(`Received from redis: ${data}`);
        return data;
    })
}

// function getDependencies(key)
// {
//     // const getAsync = promisify(client.get).bind(key);
//     // getAsync.then(function(res){console.log(res)}).catch(console.error);
//     client.get(key);
// }
module.exports.getDependencies=getDependencies;
module.exports.setDependencies=setDependencies;