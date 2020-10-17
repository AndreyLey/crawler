const get_version = (tag_string) =>
{
    const range_char = tag_string.substring(0,1);
    console.log(`get_versioin range: ${range_char}, tag:${tag_string}`);
    if(range_char == '^' || range_char == '~')
        return tag_string.substring(1);
    else
        return tag_string;
}

module.exports.get_version=get_version;