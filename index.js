const fs = require('fs');
var request = require('request');

if (process.argv.length < 3) {
  throw new Error('No URL specified');
}






//console.log(`window._initialStoreState['TournamentStore'] = `.length);




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

  // Log the output
  fs.writeFile('./out/body.json', JSON.stringify(data));
});

//split 1 : //<![CDATA[
//split 2 : //]]>
//  and take [0] from each
//pick one that starts with `\nif (window._initialStoreState === undefined)`

//split by semicolons and take the 3rd statement [2]
//cutoff front of assignment to just leave the JSON data for the bracket display
