// * url = "http://github.com/carbonfive/raygun" -> domain name = "github"
// * url = "http://www.zombie-bites.com"         -> domain name = "zombie-bites"
// * url = "https://www.cnet.com"                -> domain name = cnet"


function getDomainName (link) {
    return link
        .replace("http://", "")
        .replace("https://", "")
        .replace("www.", "")
        .split(".")[0];
}

console.log(getDomainName("http://github.com/carbonfive/raygun"));
console.log(getDomainName("http://www.zombie-bites.com"));
console.log(getDomainName("https://www.cnet.com"));