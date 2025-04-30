const returnMessage = document.getElementById("returnMessage");
const form = document.getElementById("check_form");

form.addEventListener("submit", async function onsubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const userInput = formData.get("input_box");

  const inputData = { userInput }; //sends data as a POST
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  };

  try {
    const response = await fetch("/check-url", options);
    const threatPoints = await response.json();
    console.log(threatPoints);

    if (threatPoints == 0) {
      returnMessage.textContent = "✓ Safe Site (proceed) ✓";
      returnMessage.className = "output safe";
    } else if (threatPoints >= 1 && threatPoints <= 3) {
      returnMessage.textContent = "! Suspicious Site (proceed with caution) !";
      returnMessage.className = "output suspicious";
    } else {
      returnMessage.textContent = "!!! Dangerous Site (should not proceed) !!!";
      returnMessage.className = "output dangerous";
    }
    returnMessage.style.display = "block";
  } catch (err) {
    console.error(err);
  }


  const urlFormat = /^https?:\/\/([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
  if (!urlFormat.test(userInput)) {
    returnMessage.textContent = "Please enter a valid URL";
    returnMessage.className = "output invalidURL";
    return;
  }
});
