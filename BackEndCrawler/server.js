const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Mongo_Client = require('mongodb').MongoClient;
const app = express();
var expressWs = require('express-ws')(app);

app.use(bodyParser.json());
app.use(cors());

const PROTOCOL = 'http';
const DOMAIN = process.env.DOMAIN || 'localhost';
const PORT = process.env.PORT || 5050;

const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_DB = process.env.MONGO_HOST || 'crawler';

Mongo_Client.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}`, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client)=>{
    if(err) return console.log(err);
    const db =client.db(MONGO_DB);
    app.db= db;
    require('./app/routes')(app,db);

    app.listen(PORT, ()=>{
        console.log("We are live on port: " + PROTOCOL+ "//" + DOMAIN + ":" + PORT);
    })
});
