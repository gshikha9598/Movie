let dropArea = document.getElementById("drop-area");
let inputFile = document.getElementById("input-file");
let imageView = document.getElementById("img-view");
let submitButton = document.getElementById("submit");
let cancelButton = document.getElementById("cancel");
let movieForm = document.getElementById("movieForm");
const container = document.querySelector(".container");

inputFile.addEventListener("change", uploadImage);

function uploadImage(event) {
  event.preventDefault();
  let imageLink = URL.createObjectURL(inputFile.files[0]);
  imageView.style.backgroundImage = `url(${imageLink})`;
  imageView.textContent = "";
}

cancelButton.addEventListener("click", function (event) {
  event.preventDefault();
  window.location.assign("main.html");
});

function mainPage(first_name, last_name) {
  window.location.assign(
    `main.html?first_name=${encodeURIComponent(
      first_name
    )}&last_name=${encodeURIComponent(last_name)}`
  );
}

const url = "http://localhost:8000/api/users";

// Function to fetch data from the API
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // console.log("Data", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for the caller to handle if needed
  }
}

async function acceptData(first_name, last_name) {
  try {
    // Check if first_name and last_name are not null
    if (!first_name || !last_name) {
      console.log("First name or last name is missing");
      return;
    }

    // Create a new data object
    const newData = {
      first_name: first_name,
      last_name: last_name,
    };
    console.log(newData);

    //Send the new data to the server
    await sendDataToServer(newData);
    mainPage(first_name, last_name);
  } catch (error) {
    console.error("Error accepting data:", error);
  }
}

async function sendDataToServer(data) {
  const url = "http://localhost:8000/api/users";

  try {
    const formData = new URLSearchParams();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to send data to server");
    }
  } catch (error) {
    console.error("Error sending data to server:", error);
    throw error;
  }
}

movieForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Retrieve the current values of first_name and last_name fields when the submit button is clicked
  let first_name = document.getElementById("fname").value.trim();
  let last_name = document.getElementById("lname").value.trim();

  submitData(first_name, last_name);
  acceptData(first_name, last_name);
});

function submitData(first_name, last_name) {
  if (first_name === "") {
    alert("First name is required.");
    return;
  }
  if (last_name === "") {
    alert("Last name is required.");
    return;
  }
}

var key = localStorage.getItem("code");

if (key === "secret") {
} else {
  window.location.href = "signIn.html";
}
