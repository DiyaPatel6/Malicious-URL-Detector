// document.addEventListener("DOMContentLoaded", function onload(){

//   const form = document.getElementById("check_form");
//   console.log(form); //like print in python
  
// })


const form = document.getElementById("check_form");
console.log(form); //like print in python

form.addEventListener("submit", function onsubmit(event){
  event.preventDefault();                
  
  const formData = new FormData(form);
  const userInput = formData.get("input_box");  
  
  console.log("submit", event);
})





//get access form data 




function result()
{
  // const userInput = document.querySelector(".input_box").value;       //gets the userinput
  const returnMessage = document.getElementById("returnMessage");     //output messages (classes) sorted under returnMessage id


  if (userInput === "hi")    //temporary placeholder
  {
    returnMessage.textContent = "✓ Safe Site (proceed) ✓";
    returnMessage.className = "output safe"
  }
  else if (userInput === "hello")   //temporary placeholder
  {
    returnMessage.textContent = "! Suspicious Site (proceed with caution) !";
    returnMessage.className = "output suspicious"
  }
  else    //temporary placeholder
  {
    returnMessage.textContent = "!!! Dangerous Site (should not proceed) !!!";
    returnMessage.className = "output dangerous"    
  }

  returnMessage.style.display = "block";       //actually displays the status message 
}



//TO DO

//add function that uses regex to check if url is safe and returns true or false. substitute that for current if, else if, else blocks
//also consider when user inputs something that probabbly isn't a website at all (eg, just some text)