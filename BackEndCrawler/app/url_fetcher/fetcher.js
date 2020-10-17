const axios = require('axios');
const cheerio = require('cheerio');


const fetchUrls = async (url)=>
{
    const links = [];
    let title='';
    try
    {
        console.log("Start fetching");
        const res = await fetchData(url);
        const html = res.data;
    
        const $ = cheerio.load(html);
        title = $('title').first().text();
        const hlinks = $('a');
        hlinks.each(function(i,link) {
            // var link = $(this.attr('href'));
            // links.push(link);
            links.push($(link).attr("href"));
            // console.log(link);
        })
    }
    catch(err)
    {
        console.log(err);
    }
    return {title: title, links:links};
}

const fetchData = async(url)=>{
    console.log("Crawling data...")
    const response = await axios(url).catch((err) => console.log(err));

    if(response.status !== 200){
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}

module.exports.fetchUrls = fetchUrls;