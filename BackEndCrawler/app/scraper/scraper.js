const {Queue} = require('../queue/queue');
const {fetchUrls} = require('../url_fetcher/fetcher');
const {DBConnetor, DBConnector} = require('../dbconnector/mdbconnector');

const scrapeUrl = async (collectionName,ws,dbconnector, message, req, uid) =>{
    try
    {
    const rootPage = JSON.parse(message);
    const {url, max_depth, max_pages} = rootPage;

    console.log(`Scraping  started for UID: ${uid}`);
    console.log(`Root page is: ${rootPage.url}`);
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
            const validLinks = [];
            const {title, links, isFromDb} = await getLinksAndTitle(dbconnector, collectionName,pageToFetch.url);
            scraped_pages_counter=scraped_pages_counter+1;
            //Handle links of the page
            for(const link of links)
            {
                if(link && link.startsWith("http"))
                {
                    const dbresult =await dbconnector.findOneScrapedPage(collectionName,link);
                    if(!dbresult || (dbresult && !(dbresult.uid===uid)))
                    {
                        console.log("New link: "+link);
                        urlQueue.enqueue({'url':link, 'depth': pageToFetch.depth+1});
                    }
                    validLinks.push(link);
                }
            }
            console.log(title);
            if(!isFromDb)
            {
                dbconnector.saveScraping(collectionName,uid,title,pageToFetch.url,pageToFetch.depth, validLinks);
            }
            ws.send(JSON.stringify({
                'status':'In progress',
                'root':rootPage.url,
                'title':title,
                'url':pageToFetch.url,
                'depth':pageToFetch.depth, 
                'linksCount':validLinks.length}));
        }
        else{
            ws.send(finishedResult(rootPage.url,'Finished'));
            return;
        }
    }
    ws.send(finishedResult(rootPage.url, 'Finished'));
    return;
    }
    catch(err)
    {
        console.log(`Error while scraping: ${err}`)
        ws.send(finishedResult(rootPage.url,err));
    }
}

const finishedResult = (url, status) =>{

    return JSON.stringify({
        'status': status,
        'root':url,
        'title':'',
        'url':'',
        'depth':'', 
        'linksCount':''
        });
}

const getLinksAndTitle = async(dbconnector,collectionName,url)=>{
    const dbresult = await dbconnector.findOneScrapedPage(collectionName, url);
    if(dbresult)
    {
        console.log(`FROM DB: ${JSON.stringify(dbresult)}`);
        dbresult.isFromDb=true;
        return dbresult;
    }
    const fetchResult = await fetchUrls(url);
    fetchResult.isFromDb = false;
    return fetchResult;
}

module.exports.scrapeUrl = scrapeUrl;
