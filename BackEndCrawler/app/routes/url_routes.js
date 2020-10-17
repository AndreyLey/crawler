const {scrapeUrl} = require('../scraper/scraper');
const {DBConnector} = require('../dbconnector/mdbconnector');

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
  };

module.exports = async function(app,db){


    app.get('/ping',(req,res)=>{
        res.send('pong');
    });

    app.ws('/ws', function(ws, req) {
        const mdb = new DBConnector(db)
        ws.on('message', function(msg,req) {
            console.log(JSON.stringify(msg))
            scrapeUrl('srapingCollection',ws,mdb,msg,req,getUniqueID());
        });
        console.log('socket');
    });
};