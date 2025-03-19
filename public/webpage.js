const returnMessage = document.getElementById("returnMessage");    
const form = document.getElementById("check_form");

form.addEventListener("submit", function onsubmit(event){
  event.preventDefault();                

  const formData = new FormData(form);
  const userInput = formData.get("input_box");
  
  console.log(userInput)

  if (userInput === "hi") {
    returnMessage.textContent = "✓ Safe Site (proceed) ✓";
    returnMessage.className = "output safe"
  } else if (userInput === "hello") {
    returnMessage.textContent = "! Suspicious Site (proceed with caution) !";
    returnMessage.className = "output suspicious"
  } else {
    returnMessage.textContent = "!!! Dangerous Site (should not proceed) !!!";
    returnMessage.className = "output dangerous"    
  }
  returnMessage.style.display = "block";   
})
