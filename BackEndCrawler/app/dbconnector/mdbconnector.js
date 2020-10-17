class DBConnector
{ 
    constructor(db) 
    { 
        this.db = db; 
    } 

    saveScraping = async (collectionName,uid,title, url, depth, links) =>
    {
        try{
            console.log("In saving to Mongo..");
            let result = await this.db.collection(collectionName).insertOne({uid:uid,title:title, url:url, depth:depth, links:links});
            console.log("Saved to Mongo");
            return result;
        }
        catch(err)
        {
            console.log(err);
            return null;
        }
    }


    findOneScrapedPage = async (collectionName,url) =>
    {
        try
        {
            console.log("Searching in Mongo..");
            let result = await this.db.collection(collectionName).findOne({url:url});
            console.log(`Searching finished with ${result}`);
            return result;
            
        }
        catch(err)
        {
            console.log(err);
            return null;
        }

    }
}

module.exports.DBConnector = DBConnector;