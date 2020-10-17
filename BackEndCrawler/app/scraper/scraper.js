const {Queue} = require('../queue/queue');
const {fetchUrls} = require('../url_fetcher/fetcher');
const {DBConnetor, DBConnector} = require('../dbconnector/mdbconnector');

const scrapeUrl = async (ws,dbconnector, message, req) =>{
    const jsonMessage = JSON.parse(message);
    const {url, max_depth, max_pages} = jsonMessage;

    console.log("Scraping  started");
    const rootPage = {url:url,max_depth:max_depth,max_pages:max_pages};
    //saveLastScraped(db, true, "", "","",null);
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
            const dbresult = dbconnector.findOneScrapedPage(pageToFetch.url);
            if(dbresult)
            {
                console.log(`FROM DB: ${JSON.stringify(dbresult)}`);
            }
            const {title, links} = await fetchUrls(pageToFetch.url);
            scraped_pages_counter=scraped_pages_counter+1;
            links.forEach(link => {
                if(link && link.startsWith("http") && !dbconnector.findOneScrapedPage(link))
                {
                    console.log("New link: "+link);
                    urlQueue.enqueue({'url':link, 'depth': pageToFetch.depth+1});
                    validLinks.push(link);
                }
            });
            console.log(title);
            dbconnector.saveScraping(title,pageToFetch.url,pageToFetch.depth, validLinks);
            ws.send(JSON.stringify({
                'status':'In progress',
                'root':rootPage.url,
                'title':title,
                'url':pageToFetch.url,
                'depth':pageToFetch.depth, 
                'linksCount':validLinks.length}));
        }
        else{
            ws.send(JSON.stringify({
                'status':'Finished',
                'root':rootPage.url,
                'title':'',
                'url':'',
                'depth':'', 
                'linksCount':''
                }));
            return;
        }
    }
    ws.send(JSON.stringify({
        'status':'Finished',
        'root':rootPage.url,
        'title':'',
        'url':'',
        'depth':'', 
        'linksCount':''
        }));
    return;
}

module.exports.scrapeUrl = scrapeUrl;
