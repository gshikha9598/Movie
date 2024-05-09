let submitButton = document.getElementById("submit");
let cancelButton = document.getElementById("cancel");
let firstName = document.getElementById("first_name");
let lastName = document.getElementById("last_name");

const urlParams = new URLSearchParams(window.location.search);
const id = Number(urlParams.get("id"));
const firstName1 = urlParams.get("first_name");
const lastName1 = urlParams.get("last_name");

firstName.value = firstName1;
lastName.value = lastName1;

// Cancel button functionality
cancelButton.addEventListener("click", function (event) {
  event.preventDefault();
  window.location.href = "main.html";
});

// Function to update data on API
async function updateDataOnServer(updatedData) {
  const url = `http://localhost:8000/api/users/${id}`;
  try {
    const formData = new URLSearchParams();
    for (const key in updatedData) {
      formData.append(key, updatedData[key]);
    }
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });
    if (!response.ok) {
      const errorMessage = await response.text(); // Get error message from response
      throw new Error(`Failed to update data on API: ${errorMessage}`);
    }

    // If update successful, return updated data
    return {
      id: id,
      first_name: updatedData.first_name,
      last_name: updatedData.last_name
    };

  } catch (error) {
    console.error("Error updating data on API:", error);
    throw error; // Rethrow the error to handle it outside this function if needed
  }
}

// Event listener for the submit button
submitButton.addEventListener("click", async function (event) {
  event.preventDefault();
  try {
    // Get the updated values from the input fields
    const updatedData = {
      first_name: firstName.value,
      last_name: lastName.value,
      id: id
    };

    const returnedData = await updateDataOnServer(updatedData); 
    // If update successful, redirect to main.html with updated first_name, last_name, and id
    window.location.href = `main.html?first_name=${encodeURIComponent(
      returnedData.first_name
    )}&last_name=${encodeURIComponent(
      returnedData.last_name
    )}&id=${encodeURIComponent(returnedData.id)}`;
  } catch (error) {
    console.error("Error updating data:", error);
  }
});