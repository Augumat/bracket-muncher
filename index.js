const fs = require('fs');
var request = require('request');

if (process.argv.length < 3) {
  throw new Error('No URL specified');
}

request({uri: process.argv[2]}, (error, response, body) => {
  // Grab the bracket data from the body of the response
  let data = JSON.parse(body
    // Get the CDATA chunks
    .split('//<![CDATA[')
    .map(x => x.split('//]]>')[0])
    // Find the one we're looking for and filter out everything except the bracket information
    // (This is all incredibly specific and hardcoded, but just general enough to do what I want in all foreseeable cases)
    .find(x => x.slice(0, 45) === '\nif (window._initialStoreState === undefined)')
    .split(';')[2]
    .slice(47)
  ).matches_by_round;

  // Prune unnecessary information and fill out the abbreviated templates
  Object.keys(data).forEach(round => {
    data[round] = data[round].map(x => {
      return {
        round: x.round,
        players: [
          {
            tag: x.player1.display_name,
            seed: x.player1.seed,
            score: x.scores[0]
          },
          {
            tag: x.player2.display_name,
            seed: x.player2.seed,
            score: x.scores[1]
          }
        ]
      };
    });
  });

  // Flatten data into a list of matches
  data = [].concat.apply([], Object.keys(data).map(round => data[round]));

  // Write the result to the output file
  fs.writeFile('./out/body.json', JSON.stringify(data));
});
