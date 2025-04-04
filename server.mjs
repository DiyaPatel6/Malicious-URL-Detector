import express from "express"; //imports the Express framework
import path from "path"; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); //create an instance of Express
const port = 3000; //port is what allows access to your server (3000 is a common choice)

app.get('/', (req, res) => {    //tells server to listen for a 'get' request
 res.sendFile(path.join(__dirname, '/public', 'webpage.html'));      //when url is visited, it responds with the message
});



app.use(express.json({limit: '1mb'})); //prevents too much data at once

app.post("/check-url", (req, res) => { //set up route to receive the request
 const userInput = req.body.userInput;
 const threatPoints = urlCheck(userInput);
 res.status(200).json(threatPoints); // Respond back with a JSON response
});




app.use(express.static(path.join(__dirname, '/public')));  //tells server to serve the html, css, js files in the public directory

app.listen(port, () => {                         //tells server to start listening on port 3000
 console.log('server listening on port 3000');  //prints the message
});




function urlCheck(userInput) {
  let threatPoints = 0;

  const tld = /\.(org|com|ca|edu|net)\/?$/; //add more
  const dashes = /--+/;
  const keywords = /(claim|reward|giveaway|app|free|bonus|promo)/i; //i flag for lettercase

  if (!tld.test(userInput)) {
    threatPoints += 1;
    //console.log("tld");
  }

  if (dashes.test(userInput)) {
    threatPoints += 1;
    //console.log("dash");
  }

  if (keywords.test(userInput)) {
    threatPoints += 1;
    //console.log("keyword");
  }

  //console.log(threatPoints);

  return threatPoints;
}
