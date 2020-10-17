const {Queue} = require('../queue/queue');
const {fetchUrls} = require('../url_fetcher/fetcher');

const saveUpdateScrapedPage = (db, rootPage, newlinks) =>
{
    console.log("In saving to Mongo..");

    db.collection("test",(function (err, collection) {
        if (err) console.log(err);
        collection.update({ url: rootPage.url  },{ $push: {links:{ $each: newlinks,
        $position: -2 /*{ links: newlinks }*/ }}},function (err, result) {
            if (err) console.log(err);
            console.log(`Update sraped page: ${result}`);
        })      
    }));
    console.log("Saved to Mongo");
}

const saveLastScraped = (db,isFirst,title, url, depth, links) =>
{
    console.log("In saving last to Mongo..");
    if(isFirst)
    {
        db.collection('test',(function (err, collection) {
            if (err) console.log(err);
            collection.insertOne({last:true,title:title, url:url, depth:depth, links:links},function (err, result) {
                if (err) console.log(err);
            })      
        }));
    }
    else{
        db.collection('test',(function (err, collection) {
            if (err) console.log(err);
            collection.update({last:true},{$set:{title:title, url:url, depth:depth, links:links}},function (err, result) {
                if (err) console.log(err);
            })      
        }));
    }

    // db.collection('test').estimatedDocumentCount(function (err, count) {
    //     if (err) throw err;
        
    //     console.log('Total Rows: ' + count);
    // });
    console.log("Last saved to Mongo");
}

const saveScraping = (db,title, url, depth, links) =>
{
    console.log("In saving to Mongo..");
    db.collection('test',(function (err, collection) {
        if (err) console.log(err);
        collection.insertOne({title:title, url:url, depth:depth, links:links},function (err, result) {
            if (err) console.log(err);
        })      
    }));

    // db.collection('test').estimatedDocumentCount(function (err, count) {
    //     if (err) throw err;
        
    //     console.log('Total Rows: ' + count);
    // });
    console.log("Saved to Mongo");
}


const findOneScrapedPage = (db, url) =>
{
    console.log("Searching in Mongo..");
    db.collection('test',(function (err, collection) {
        if (err) console.log(err);
        collection.findOne({url:url},function (err, result) {
            if (err) console.log(err);
            console.log(`Searching finished with ${result}`);

            return result;
        })      
    }));
}

const scrapeUrl = async (ws,db, message, req) =>{
    const jsonMessage = JSON.parse(message);
    const {url, max_depth, max_pages} = jsonMessage;

    console.log("Scraping  started");
    const rootPage = {url:url,max_depth:max_depth,max_pages:max_pages};
    saveLastScraped(db, true, "", "","",null);
    console.log(`Root page is: ${rootPage.url}`);
    const allScrapedPages =[];//
    const urlQueue = new Queue();
    urlQueue.enqueue({'url':url, depth: 0});
    let scraped_pages_counter=0;

    while(!urlQueue.isEmpty())
    {

        const pageToFetch = urlQueue.dequeue();

        //TO ADD check that you didn't scrape this url before

        console.log(`Srape in while page to fetch depth:${pageToFetch.depth} and max depth is:${max_depth} with url:${pageToFetch.url}`);

        if(pageToFetch.depth < max_depth && scraped_pages_counter<max_pages)
        {
            const {title, links} = await fetchUrls(pageToFetch.url);
            const validLinks = [];
            scraped_pages_counter=scraped_pages_counter+1;
            links.forEach(link => {
                if(link && link.startsWith("http") && !findOneScrapedPage(db,link))
                {
                    console.log("New link: "+link);
                    urlQueue.enqueue({'url':link, 'depth': pageToFetch.depth+1});
                    validLinks.push(link);
                }

            });
            console.log(title);
            allScrapedPages.push({'title':title,'url':pageToFetch.url,'depth':pageToFetch.depth, 'links':validLinks});
            saveScraping(db,title,pageToFetch.url,pageToFetch.depth, validLinks);
            ws.send(title);
            // if(!(pageToFetch.url===rootPage.url))
            // {
                //saveUpdateScrapedPage(db,rootPage, validLinks);
                saveLastScraped(db, false, title, pageToFetch.url,pageToFetch.depth,validLinks);
            // }
        }
        else{
            //ws.close();
            return;
        }
    }
    //ws.close;
    return;
}

// const scrapeUrl = async (db,url, max_depth, max_pages) =>{
//     console.log("Scraping  started");
//     const rootPage = {url:url,max_depth:max_depth,max_pages:max_pages};
//     saveLastScraped(db, true, "", "","",null);
//     console.log(`Root page is: ${rootPage.url}`);
//     const allScrapedPages =[];//
//     const urlQueue = new Queue();
//     urlQueue.enqueue({'url':url, depth: 0});
//     //Count amount of scraped pages
//     let scraped_pages_counter=0;
//     //allLinks.push({'url':url, depth: 0});//

//     while(!urlQueue.isEmpty())
//     {

//         const pageToFetch = urlQueue.dequeue();

//         //TO ADD check that you didn't scrape this url before

//         console.log(`Srape in while page to fetch depth:${pageToFetch.depth} and max depth is:${max_depth} with url:${pageToFetch.url}`);

//         if(pageToFetch.depth < max_depth && scraped_pages_counter<max_pages)
//         {
//             const {title, links} = await fetchUrls(pageToFetch.url);
//             const validLinks = [];
//             scraped_pages_counter=scraped_pages_counter+1;
//             links.forEach(link => {
//                 if(link && link.startsWith("http") && !findOneScrapedPage(db,link))
//                 {
//                     console.log("New link: "+link);
//                     urlQueue.enqueue({'url':link, 'depth': pageToFetch.depth+1});
//                     validLinks.push(link);
//                 }

//             });
//             console.log(title);
//             allScrapedPages.push({'title':title,'url':pageToFetch.url,'depth':pageToFetch.depth, 'links':validLinks});
//             saveScraping(db,title,pageToFetch.url,pageToFetch.depth, validLinks);
//             // if(!(pageToFetch.url===rootPage.url))
//             // {
//                 //saveUpdateScrapedPage(db,rootPage, validLinks);
//                 saveLastScraped(db, false, title, pageToFetch.url,pageToFetch.depth,validLinks);
//             // }
//         }
//         else{
//             return allScrapedPages;
//         }
//     }
//     return allScrapedPages;
// }
module.exports.scrapeUrl = scrapeUrl;
