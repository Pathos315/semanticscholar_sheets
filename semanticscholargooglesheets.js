function getResponse(url) {
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    return JSON.parse(json)
}

/**
 * Return the keywords of a paper using from the Dimensions.ai  based on a query.
 *
 * @param {input}  input  The query string sent to the Dimensions.ai API url.
 * @returns {doi} The keywords, as a list.
 * @customfunction
 */
function GETDIMENSIONS(input = 'prosocial', output = "mesh_terms") {
    var dataset_url = `https://app.dimensions.ai/discover/publication/results.json?search_mode=content&search_text=${input}&search_type=kws&search_field=doi`;
    var data = getResponse(dataset_url);
    for (const [key, value] of Object.entries(data.docs[0])) {
        if (key === output) {
            var result = `${value}`;
            Logger.log(result);
            return result
        };
    };
}

/**
 * Return the authors of a paper, as a string, from the Semantic Scholar API based on a query.
 *
 * @param {input}  input  The query string sent to the Semantic Scholar API url.
 * @returns {doi}  doi  The paper's authors, as a string.
 * @customfunction
 */
function GETPAPERAUTHORS(input = 'prosocial') {
    /* Gets the API from the provided URL
    then gets the response */
    ;
    var api_url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${input}&limit=1&fields=authors`;
    var data = getResponse(api_url);
    var authors = data.data[0].authors;
    var output = ""
    for (const [key, value] of Object.entries(authors)) {
        var { name } = value
        output += name + ', '
    };
    output = output.slice(0, -2)
    Logger.log(output)
    return output
}

/**
 * Return the digital object identifier (DOI) value of a paper from the Semantic Scholar API based on a query.
 * Initial use shows current time.
 *
 * @param {"input"}  input  The query string sent to the Semantic Scholar API url.
 * @returns {doi} The Digital Object Identifier (DOI) value of the requested paper.
 * @customfunction
 */
function GET_DIGITALOBJECTIDENTIFIER(input) {
    var api_url = `https://api.semanticscholar.org/graph/v1/paper/${input}?fields=externalIds`;
    var data = getResponse(api_url);
    for (const [key, value] of Object.entries(data.externalIds)) {
        if (key === 'DOI') {
            var doi = value;
            Logger.log(doi);
            return doi
        };
    };
}

/**
 * Return a given data field from the Semantic Scholar API based on its Semantic Scholar ID or 'sha'.
 * Initial use shows current time.
 *
 * @param {"649def34f8be52c8b66281af98ae884c09aef38b"}  sha  Semantic Scholar ID string to query the Semantic Scholar API.
 * @param {"title"} field The Object key to be queried, it must be one of the fields listed in the Semantic Scholar API documentation.
 * @returns {output} The values that were requested based on the provided key.
 * @customfunction
 */
function GETDETAILSFROMSHA(sha = '649def34f8be52c8b66281af98ae884c09aef38b', field = 'title') {

    var api_url = `https://api.semanticscholar.org/graph/v1/paper/${sha}?fields=${field}`;
    var data = getResponse(api_url);
    try {
        var output = data.data[0][`${field}`];
    } catch (e) {
        var output = `No data found for field. Reason: ${e}.`;
    };
    Logger.log(output);
    return output
}

/**
 * Return a given data field from the Semantic Scholar API based on a query, such as keywords
 * Initial use shows current time.
 *
 * @param {"covid+vaccination"}  input  The query string sent to the Semantic Scholar API url.
 * @param {"title"} field The Object key to be queried, it must be one of the fields listed in the Semantic Scholar API documentation.
 * @returns {output} The values that were requested based on the provided key.
 * @customfunction
 */

async function GETDETAILSFROMQUERY(input = 'prosocial', field = 'title') {
    var api_url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${input}&limit=1&fields=${field}`;
    var response = UrlFetchApp.fetch(api_url);
    var json = response.getContentText();
    var data = JSON.parse(json);
    try {
        var output = data.data[0][`${field}`];
    } catch (e) {
        var output = `No data found for field. Reason: ${e}.`;
    };
    Logger.log(output);
    return output
}