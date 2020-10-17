class DBConnector
{ 
    constructor(db) 
    { 
        this.db = db; 
    } 

    saveScraping = (title, url, depth, links) =>
    {
        console.log("In saving to Mongo..");
        this.db.collection('test',(function (err, collection) {
            if (err) console.log(err);
            collection.insertOne({title:title, url:url, depth:depth, links:links},function (err, result) {
                if (err) console.log(err);
                return result;
            })      
        }));
        console.log("Saved to Mongo");
    }


    findOneScrapedPage = (url) =>
    {
        console.log("Searching in Mongo..");
        this.db.collection('test',(function (err, collection) {
            if (err) console.log(err);
            collection.findOne({url:url},function (err, result) {
                if (err) console.log(err);
                console.log(`Searching finished with ${result}`);

                return result;
            })      
        }));
    }

//     const saveUpdateScrapedPage = (db, rootPage, newlinks) =>
// {
//     console.log("In saving to Mongo..");

//     db.collection("test",(function (err, collection) {
//         if (err) console.log(err);
//         collection.update({ url: rootPage.url  },{ $push: {links:{ $each: newlinks,
//         $position: -2 /*{ links: newlinks }*/ }}},function (err, result) {
//             if (err) console.log(err);
//             console.log(`Update sraped page: ${result}`);
//         })      
//     }));
//     console.log("Saved to Mongo");
// }

// const saveLastScraped = (db,isFirst,title, url, depth, links) =>
// {
//     console.log("In saving last to Mongo..");
//     if(isFirst)
//     {
//         db.collection('test',(function (err, collection) {
//             if (err) console.log(err);
//             collection.insertOne({last:true,title:title, url:url, depth:depth, links:links},function (err, result) {
//                 if (err) console.log(err);
//             })      
//         }));
//     }
//     else{
//         db.collection('test',(function (err, collection) {
//             if (err) console.log(err);
//             collection.update({last:true},{$set:{title:title, url:url, depth:depth, links:links}},function (err, result) {
//                 if (err) console.log(err);
//             })      
//         }));
//     }

//     // db.collection('test').estimatedDocumentCount(function (err, count) {
//     //     if (err) throw err;
        
//     //     console.log('Total Rows: ' + count);
//     // });
//     console.log("Last saved to Mongo");
// }

// const saveScraping = (db,title, url, depth, links) =>
// {
//     console.log("In saving to Mongo..");
//     db.collection('test',(function (err, collection) {
//         if (err) console.log(err);
//         collection.insertOne({title:title, url:url, depth:depth, links:links},function (err, result) {
//             if (err) console.log(err);
//         })      
//     }));
//     console.log("Saved to Mongo");
// }


// const findOneScrapedPage = (db, url) =>
// {
//     console.log("Searching in Mongo..");
//     db.collection('test',(function (err, collection) {
//         if (err) console.log(err);
//         collection.findOne({url:url},function (err, result) {
//             if (err) console.log(err);
//             console.log(`Searching finished with ${result}`);

//             return result;
//         })      
//     }));
// }
}

module.exports.DBConnector = DBConnector;