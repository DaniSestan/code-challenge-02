API_URL = "https://api.tvmaze.com"
SHOW_ID = "2993"

exports.SHOW_ID = "2993"

exports.routing = {
    SHOW: `${API_URL}/shows/${SHOW_ID}`,
    SEASONS: `${API_URL}/shows/${SHOW_ID}/seasons`,
    EPISODES: `${API_URL}/shows/${SHOW_ID}/episodes`
}

exports.filePaths = {
    DATA: './data.json'
}