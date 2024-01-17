const https = require('https');

https.get('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard', (res) => {
    let data = '';

    // A chunk of data has been received.
    res.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Process the result.
    res.on('end', () => {
        const jsonData = JSON.parse(data);
        if (jsonData.events) {
            jsonData.events.forEach(event => {
                if (event.competitions && event.competitions[0].odds && event.competitions[0].odds[0].overUnder) {
                    const overUnder = event.competitions[0].odds[0].overUnder;
                    const competitors = event.competitions[0].competitors;
                    const totalScore = competitors.reduce((sum, team) => sum + parseInt(team.score), 0);
                    console.log(`Game ID: ${event.id}, Over/Under: ${overUnder}, Total Score: ${totalScore}`);
                }
            });
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
