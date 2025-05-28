const returnMessage = document.getElementById("returnMessage");
const form = document.getElementById("check_form");

const historyBox = document.getElementById("historyBox");
const historyButton = document.getElementById("historyButton");
const historyList = [];

historyButton.addEventListener("click", function () {
  if (historyBox.style.display === "none") {
    let content = "";

    for (let i = 0; i < historyList.length; i++) {
      content += historyList[i].status + " -- " + historyList[i].url + "<br>";
    }

    historyBox.innerHTML = content;
    historyBox.style.display = "block";
  } else {
    historyBox.style.display = "none";
  }
});

form.addEventListener("submit", async function onsubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const userInput = formData.get("input_box");

  const urlFormat = /^https?:\/\/([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;
  if (!urlFormat.test(userInput)) {
    returnMessage.textContent = "Please enter a valid URL";
    returnMessage.className = "output invalidURL";
    historyList.push({status: "INVALID URL", url: userInput});
    return;
  }

  const inputData = { userInput };
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
      historyList.push({status: "SAFE", url: userInput});
    } else if (threatPoints >= 1 && threatPoints <= 2) {
      returnMessage.textContent = "! Suspicious Site (proceed with caution) !";
      returnMessage.className = "output suspicious";
      historyList.push({status: "SUSPICIOUS", url: userInput});
    } else {
      returnMessage.textContent = "!!! Dangerous Site (should not proceed) !!!";
      returnMessage.className = "output dangerous";
      historyList.push({status: "DANGEROUS", url: userInput});
    }
    returnMessage.style.display = "block";
  } catch (err) {
    console.error(err);
  }
});