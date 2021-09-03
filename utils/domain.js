exports.extractDomain=async(url)=>{
    let domain = (new URL(url));
    domain = domain.hostname;
    console.log(domain.replace(/www./g,""));
    return(domain.replace(/www./g,""));
}