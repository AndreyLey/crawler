const fetch = require('node-fetch');
const {get_version} = require('./string_parser');

async function getPackageInfo(req,res,next)
{
        try{
            console.log('Start fetching...')
            const {name, tag_name}=req.params;
            const response = await fetch(`https://registry.npmjs.org/${name}/${tag_name}`);
            const data = await response.json();
            // console.log(data);
            console.log(`Dependencies is: `)
            console.log(data.dependencies)
            // console.log(`Dev Dependencies: `);
            // console.log(data.devDependencies);
            console.log('Fetching finished.')
            req.params={dependencies:data.dependencies, devDependencies:data.devDependencies};//, dev: data.devDependencies};
            //res.send({production: data.dependencies, dev: data.devDependencies});
            next();
        }
        catch(err)
        {
            console.log(err);
            res.status(500);
        }
    
};

const recurtion_getPackages = async (name, tag_name) =>
{
    try{
        console.log('recurtion_getPackages: Start fetching...')
        const dep = await fetch_and_orgenize(name,tag_name);
        const rec_dep = await get_allTree(dep); 
        console.log(`recurtion_getPackages: Repositiry: ${rec_dep}`);
        return rec_dep;
    }
    catch(err)
    {
        console.log(err);
        res.status(500);
    }
}

const get_allTree = async (dependencies) =>
{
    console.log(`Starts in get_allTree: ${JSON.stringify(dependencies)}`);
    if(dependencies===null || dependencies.length ==0)
    {
        return [];
    }
    console.log(`Before for get_allTree`);
    for (var index in dependencies )
    {
        console.log(`Print dependencie get_AllTree ${JSON.stringify(dependencies[index])}`);
        var dep = await  fetch_and_orgenize(dependencies[index].name, dependencies[index].tag);
        console.log(dep.length);
        console.log(`Dependencies fetched get_AllTree ${JSON.stringify(dep)}`);
        dependencies[index].dep  = await get_allTree(dep);
    }
    return dependencies;
}

const fetch_and_orgenize = async (name, tag_name) =>
{
    const tag_tosearch = get_version(tag_name);
    console.log(`Fetching name: ${name} and tag: ${tag_tosearch}`);
    const response = await fetch(`https://registry.npmjs.org/${name}/${tag_tosearch}`);
    const data = await response.json();
    //console.log(`Get from url fetch_and_orgenize: ${JSON.stringify(data)}`);

    let dep_array=[];
    let dep_from_data = 
    {
        ...data.dependencies//,
        //...data.devDependencies
    };

    for(const[key,value] of Object.entries(dep_from_data))
    {
        var new_dep={
            name : key,
            tag : value,
            dep : []
        };
        dep_array.push(new_dep);
    }
    //console.log(`Returned dep from fetch_and_orgenize: ${JSON.stringify(dep_array)}`);
    return dep_array;
}

module.exports.recurtion_getPackages = recurtion_getPackages;
module.exports.getPackageInfo = getPackageInfo;