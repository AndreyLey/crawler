const {scrapeUrl} = require('../scraper/scraper');

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
    // const sync_result = {
    //     'url_req': req.body,
    //     'success':'true',
    //     'message':'Url seccussefuly received',
    //     'scraped_pages' : result
    //  }
    // res.send(sync_result);
}

module.exports = async function(app,db){

    // app.use(function(req,res,next){
    //     req.db=db;
    //     //req.ws=ws;
    //     return next();
    // });

    app.get('/ping',(req,res)=>{
        db.collection('test').count(function (err, count) {
            if (err) throw err;      
            console.log('Total Rows: ' + count);
        });
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

    app.post('/url',/*function(req,res,next){req.db=db;next();},*/asyncmiddleware);

    app.ws('/', function(ws, req) {
        ws.on('message', function(msg,req) {
            db.collection('test').count(function (err, count) {
                if (err) throw err;      
                console.log('Total Rows: ' + count);
                ws.send(count);
            });
          console.log(msg);
          ws.send(msg);
        });
        console.log('socket');
      });

      app.ws('/ws', function(ws, req) {
        ws.on('message', function(msg,req) {
            console.log(JSON.stringify(msg))
            let mdb=db;
            scrapeUrl(ws,mdb,msg,req)
        });
        console.log('socket');
      });
    // app.post('/urlTest',(req, res)=>{
    //     console.log(req.body);
    //     const sync_result = {
    //         'url_req': req.body,
    //         'success':'true',
    //         'message':'Url seccussefuly received'
    //      }
    //     res.send(sync_result);
    // });
};