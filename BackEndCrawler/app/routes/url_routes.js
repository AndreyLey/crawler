const {scrapeUrl} = require('../scraper/scraper');
const {DBConnector} = require('../dbconnector/mdbconnector');
const asyncmiddleware = async(req,res) =>{
    const {url, max_depth, max_pages}=req.body;
    const result = await scrapeUrl(req.db,url, max_depth, max_pages);
    console.log('Before send in asyncmiddleware');
    const sync_result = {
        'url_req': req.body,
        'success':'true',
        'message':'Url seccussefuly received',
        'scraped_pages' : result
     }
    res.send(sync_result);
}

const asyncmiddleware_ws = async(msq,req) =>{
    console.log('Start send in asyncmiddleware');
    await scrapeUrl(req);
}

module.exports = async function(app,db){


    app.get('/ping',(req,res)=>{
        // db.collection('test').count(function (err, count) {
        //     if (err) throw err;      
        //     console.log('Total Rows: ' + count);
        // });
        res.send('pong');
    });

    app.get('/lastScraped', (req,res)=>{
        db.collection('test',(function (err, collection) {
            if (err) console.log(err);
            collection.findOne({last:true},function (err, result) {
                if (err) console.log(err);
                console.log(`Searching finished with ${result}`);
    
                res.send(result);
            })      
        }));
    })

    app.ws('/ws', function(ws, req) {
        const mdb = new DBConnector(db)
        ws.on('message', function(msg,req) {
            console.log(JSON.stringify(msg))
            // let mdb=db;
            scrapeUrl(ws,mdb,msg,req);
        });
        console.log('socket');
    });
};