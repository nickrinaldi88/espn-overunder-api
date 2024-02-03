const https = require('https');
const today = new Date();
const yesterday = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);
const yyyyMMdd = yesterday.toISOString().split('T')[0].replace(/-/g, '');

console.log(yyyyMMdd);

const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${yyyyMMdd}`;

https.get(url, (res) => {
    let data = '';

    // A chunk of data has been received.
    res.on('data', (chunk) => {
        data += chunk;
        // console.log(data);
    });



    // The whole response has been received. Process the result.
    res.on('end', () => {
        const jsonData = JSON.parse(data);
        if (jsonData.events) {
            jsonData.events.forEach(event => {
                if (event.competitions && event.competitions[0].odds && event.competitions[0].odds[0].overUnder) {
                    // console.log("true");
                    const overUnder = event.competitions[0].odds[0].overUnder;
                    const competitors = event.competitions[0].competitors;
                    const totalScore = competitors.reduce((sum, team) => sum + parseInt(team.score), 0);
                    const teamNames = competitors.map(team => team.team.displayName).join(' vs ');

                    console.log(`Game: ${teamNames}, Over/Under: ${overUnder}, Total Score: ${totalScore}`);
                }
            });
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
