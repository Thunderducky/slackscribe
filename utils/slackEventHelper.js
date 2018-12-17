const url = require("url");

const extractLinks = (source) => {
  const links = []
  if(!source){
    return links;
  }

  source = source.toLowerCase();
  source.replace(/\<http(.*?)\>/g, function(_, match){
    const matches = ("http" + match).split("|");
    const myUrl = url.parse(matches[0]);
    const result = {
      url: matches[0],
      label: matches[1] || matches[0],
      domain: `${myUrl.protocol}//${myUrl.host}`
    }
    links.push(result);
  });
  return links;
}

module.exports = {
  extractLinks
};
