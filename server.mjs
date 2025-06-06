import dotenv from 'dotenv'; 
dotenv.config(); 
import express from "express"; 
import rateLimit from 'express-rate-limit';
import path from "path"; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); 
const port = 3000; 

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
  message: "Too many requests. Try again after 15 minutes"
})

app.use(limiter);

app.get('/', (req, res) => {    
 res.sendFile(path.join(__dirname, '/public', 'index.html'));     
});

app.use(express.json({limit: '1mb'})); 

function isValidUrl(url) {
  const urlFormat = /^https?:\/\/([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
  return urlFormat.test(url);
}

app.post("/check-url", async (req, res) => { 
  const userInput = req.body.userInput;

if (!isValidUrl(userInput)) {
  return res.status(400).json({ error: "Invalid URL format" });
}

const url = urlCheck(userInput);
const virus = virusTotal(userInput);
const safebrow = safeBrowsing(userInput);

const threatPoints = await Promise.all([url, virus, safebrow]);
let sum = 0;
for(let i = 0; i < threatPoints.length; i++){
  sum += threatPoints[i];
}
 res.status(200).json(sum); 
});

app.use(express.static(path.join(__dirname, '/public')));  

app.listen(port, () => {                        
 console.log('server listening on port 3000');  
});

async function urlCheck(userInput) {
  let threatPoints = 0;
  const tld = /\.(org|com|ca|edu|net|io)\/?$/; 
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
  const shortenedUrl = userInput.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const base64userInput = Buffer.from(encodeURIComponent(shortenedUrl)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const url = `https://www.virustotal.com/api/v3/urls/${base64userInput}`;

  try {
    const response = await fetch(url, {
      method: "GET", 
      headers: {
        "x-apikey": process.env.virusTotalKey 
      }
    });
    if (!response.ok) {
      const body = await response.text();
      console.log(body);
      throw new Error('Website not found');
    }
    const data = await response.json();
    
    console.log("Malicious:", data.data.attributes.last_analysis_stats.malicious);
    console.log("Suspicious:", data.data.attributes.last_analysis_stats.suspicious);

    const maliciousCount = data.data.attributes.last_analysis_stats.malicious;
    const suspiciousCount = data.data.attributes.last_analysis_stats.suspicious;

    if (maliciousCount > 0){
      threatPoints += 2;}
    if (suspiciousCount > 0){
      threatPoints += 2;}
  }
  catch(error){
    console.error("Error calling VirusTotal API:", error);
  }
  return threatPoints;
  }

  async function safeBrowsing(userInput) {
    let threatPoints = 0;
    const url = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.safeBrowsingKey}`;
    const body = {
      "client": {
        "clientId": "Malicious-URL-Detector",
        "clientVersion": "1.0"
      },
      "threatInfo": {
        "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
        "platformTypes": ["ANY_PLATFORM"],
        "threatEntryTypes": ["URL"],
        "threatEntries": [{"url": userInput}]
      }
    }

    try {
      const response = await fetch(url, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const text = await response.text();
        console.log(text);
        throw new Error('Error calling SafeBrowsing API');
      }
      const data = await response.json();

      if (data && data.matches && data.matches.length > 0){
        threatPoints += 2;
        console.log("Threats found by Safe Browsing:", data.matches);
      }
    }
    catch(error){
      console.error("Error calling SafeBrowsing API:", error);
    }
  return threatPoints;
  }