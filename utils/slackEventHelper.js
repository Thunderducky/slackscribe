const url = require("url");

const extractLinks = (source) => {
  const links = []
  if(!source){
    return links;
  }

  // source = source.toLowerCase();
  // The links/messages from slack ar always in the format <hyperlink | name >
  // this function extracts those pieces as best it can
  source.replace(/\<http(.*?)\>/gi, function(_, match){
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
