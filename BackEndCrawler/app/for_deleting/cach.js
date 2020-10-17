const {getDependencies}=require('./redis_dbconnector');
const {setDependencies}=require('./redis_dbconnector');

function fromCach(req, res, next)
{
    console.log("From cach..");
    const {name, tag_name}=req.params;
    //const cached = getDependencies(req.app.db,name)
    //cached.then(function(res){console.log(res)});
    req.app.db.get(name,(error, data)=>
    {
        if(error) console.log(error);
        if(data !== null)
        {
            console.log(`Received from redis: ${data}`);
            res.send(data);
        }
        else{
            next();
        }
    });
    // if(cached !== null)
    // {
    //     console.log(`Returned from db_connector: ${cached}`);
    //     res.send(cached);
    // }
    // else{
    //     next();
    // }
}

function toCach(req,res)
{
    console.log(`To cach..`);

    const {name, tag_name, dependencies}=req.params;
    //setDependencies(name,tag_name);
    res.send(req.params);
}

module.exports.toCach = toCach;
module.exports.fromCach = fromCach;