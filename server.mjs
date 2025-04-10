import dotenv from 'dotenv'; 
dotenv.config(); 
const apiKey = process.env.virusTotalKey; 


import express from "express"; 
import path from "path"; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); 
const port = 3000; 

app.get('/', (req, res) => {    
 res.sendFile(path.join(__dirname, '/public', 'webpage.html'));     
});


app.use(express.json({limit: '1mb'})); 

app.post("/check-url", (req, res) => { 
 const userInput = req.body.userInput;
 const threatPoints = urlCheck(userInput) + virusTotal(userInput); //added virusTotal
 res.status(200).json(threatPoints); 
});


app.use(express.static(path.join(__dirname, '/public')));  

app.listen(port, () => {                        
 console.log('server listening on port 3000');  
});




async function urlCheck(userInput) {
  let threatPoints = 0;

  const tld = /\.(org|com|ca|edu|net)\/?$/; 
  const dashes = /--+/;
  const keywords = /(claim|reward|giveaway|app|free|bonus|promo)/i; 

  if (!tld.test(userInput)) {
    threatPoints += 1;}

  if (dashes.test(userInput)) {
    threatPoints += 1;}

  if (keywords.test(userInput)) {
    threatPoints += 1;}

  return threatPoints;
}



async function virusTotal(userInput) {
  let threatPoints = 0;

  try {
    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${userInput}`, {
      method: "GET", 
      headers: {
        "x-apikey": process.env.virusTotalKey 
      }
    });
    if (!response.ok) {
      throw new Error('Could not fetch data from VirusTotal');
    }
    const data = await response.json();
    console.log(data);

    const maliciousCount = data.data.attributes.last_analysis_stats.malicious;
    const suspiciousCount = data.data.attributes.last_analysis_stats.suspicious;

    if (maliciousCount > 0){
      threatPoints += 1;}
    if (suspiciousCount > 0){
      threatPoints += 1;}
  }
  catch(error){
    console.error("Error calling VirusTotal API:", error);
  }
  return threatPoints;
}
