const returnMessage = document.getElementById("returnMessage");    
const form = document.getElementById("check_form");
let threatPoints = 0; 

form.addEventListener("submit", function onsubmit(event){
  event.preventDefault();                

  const formData = new FormData(form);
  const userInput = formData.get("input_box");
  threatPoints = 0



  const inputData = {userInput}; //sends data as a POST
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inputData)
  };
  fetch("/check-url", options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
 

  const urlFormat = /^https?:\/\/([0-9a-z-]+\.)+[0-9a-z]{2,6}(\/[0-9a-z-]*)?$/
  if (!urlFormat.test(userInput))
  {
    returnMessage.textContent = "Please enter a valid URL";
    returnMessage.className = "output invalidURL";
    return;
  }

  urlCheck(userInput);

  if (threatPoints == 0) {
    returnMessage.textContent = "✓ Safe Site (proceed) ✓";
    returnMessage.className = "output safe"; 
  } else if (threatPoints >= 1 && threatPoints <= 2) {
    returnMessage.textContent = "! Suspicious Site (proceed with caution) !";
    returnMessage.className = "output suspicious";
  } else {
    returnMessage.textContent = "!!! Dangerous Site (should not proceed) !!!";
    returnMessage.className = "output dangerous";    
  }
  returnMessage.style.display = "block";   
})



function urlCheck(userInput)
{
 const tld = /\.(org|com|ca|edu|net)\/?$/;  //add more
 const dashes = /--+/;
 const keywords = /(claim|reward|giveaway|app|free|bonus|promo)/i; //i flag for lettercase

 if (!tld.test(userInput)){
  threatPoints += 1;
  console.log("tld");}

 if (dashes.test(userInput)) {
  threatPoints += 1;
  console.log("dash");}

 if (keywords.test(userInput)){
  threatPoints += 1;
  console.log("keyword");}

  
 console.log(threatPoints);
}
