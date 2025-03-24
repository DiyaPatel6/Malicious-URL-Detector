const returnMessage = document.getElementById("returnMessage");    
const form = document.getElementById("check_form");

form.addEventListener("submit", function onsubmit(event){
  event.preventDefault();                

  const formData = new FormData(form);
  const userInput = formData.get("input_box");
  
  if (!userInput.includes("."))
  {
    returnMessage.textContent = "Please enter a valid URL";
    returnMessage.className = "output invalidURL";
    return;
  }




  threatPoints = 0;

  urlCheck(userInput);


  if (threatPoints <= 1) {
    returnMessage.textContent = "✓ Safe Site (proceed) ✓";
    returnMessage.className = "output safe";
  } else if (2 <= threatPoints <= 5) {
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

  const tld = /\.(info|top|shop|goog|cn|ru|rf|icu|gd|sbs|vip|cc|xyz|app|click|dev|online)$/;  //add more
  const dashes = /--+/;

  if (tld.test(userInput))
  {
    threatPoints += 1;
  }

  if (dashes.test(userInput))
  {
    threatPoints += 1;
  }


  console.log(threatPoints);
  
  
}