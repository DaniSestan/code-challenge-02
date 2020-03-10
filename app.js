const http = require("http")
const https = require('https');
const routing = require("./constants")
const dataHandler = require("./dataHandlers")
const fs = require('fs');


http.createServer((req, res) => {
    let i = 0;
    let responses = []

    for (let url of Object.keys(routing.routing)) {
        https.get(routing.routing[url], (resp) => {
            let data = ''
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', async () => {
                if (url == 'SHOW'){
                    let obj = []
                    obj.push(JSON.parse(data))
                    responses.push(obj)
                } else
                    responses.push(JSON.parse(data))
                if(i++ == Object.keys(routing.routing).length - 1) {
                    dataHandler.getResponse(responses);
                    let json = null;
                    // ...hacky, but worky. Prefer not to use a timeout function
                    // here / Promises might be used to implement something to wait for the
                    // response to be written to json data file but
                    // going with this approach to meet my own deadline for this.
                    setTimeout(function(){
                        fs.readFile('./data.json', 'utf8',
                            async function readFileCallback(err, jsonData){
                                if (err)
                                    console.log(err);
                                else {
                                    json = await JSON.parse(jsonData);
                                    res.end(JSON.stringify(json));
                                }
                            });
                        },1600);
                }
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
}).listen(3000);
