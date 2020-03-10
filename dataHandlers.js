const _ = require("lodash");
const routing = require("./constants")
const fs = require('fs');

const dataFile = routing.filePaths['DATA'];

exports.getResponse = (response) => {
    let showData = []
    let seasonsData = []
    let episodesData = []
    for (i = 0; i < _.size(response); i++) {
        let data = response[i]
        let url = data[0]["url"]

        if(url.includes('/shows/'))
            showData = data;
        else if (url.includes('/seasons/'))
            seasonsData = data;
        else if(url.includes('/episodes/'))
             episodesData = data;
        else
            console.log('An error occurred while received JSON data response.')
    }

    getAggregates(showData, seasonsData, episodesData);

}

const getAggregates = (showData, seasonsData, episodeData) => {
    let showId = showData[0]['id'];
    let runtime = showData[0]['runtime'];
    let seasons = _.size(seasonsData);
    let episodes = 0;
    for (let i = 0; i < seasons; i++)
        episodes += seasonsData[i]['episodeOrder']
    let averageEpisodesPerSeason = (episodes/seasons).toFixed(1);
    let totalDurationSec = episodes * runtime;

    let jsonData = {}
    let id = showId;
    jsonData[id] = {};
    jsonData[id]["totalDurationSec"] = totalDurationSec;
    jsonData[id]["averageEpisodesPerSeason"] = averageEpisodesPerSeason;
    jsonData[id]["episodes"] = []
    episodeData.forEach((i, j) => {
        let episode = {};
        episode["sequenceNumber"] = 's' + episodeData[j]["season"] +
            'e' + episodeData[j]["number"]
        const name = episodeData[j]["name"]
        const shortTitle = name.substring((name.indexOf(":") + 1), name.length);
        episode["shortTitle"] = shortTitle.trim();
        let time = episodeData[j]["airstamp"]
        if (time) {
            time = new Date(time.substring(0, time.indexOf('+')))
            episode["airTimestamp"] = time.getTime()/1000.0;
        } else
            episode["airTimestamp"] = time;
        jsonData[id]["episodes"].push(episode)
        let summary = episodeData[j]["summary"]
        if (summary)
            summary = summary.substring((summary.indexOf(">") + 1), (summary.indexOf(".") + 1));
        episode["shortSummary"] = summary;
    });

    writeData(jsonData)
}

const writeData = (obj) => {
    const json = JSON.stringify(obj);
    fs.writeFile(dataFile, json,
        'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        });
}