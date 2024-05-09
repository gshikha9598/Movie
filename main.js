const itemsPerPage = 8; // Number of items to display per page
let currentPage = 1; // Current page
let totalPages; // Total number of pages
let apiData; // Define apiData globally
const container = document.querySelector(".container");
const paginationContainer = document.querySelector(".pagination");
const params = new URLSearchParams(window.location.search); 
const firstName = params.get("first_name");
const lastName = params.get("last_name");

const url = "http://localhost:8000/api/users";

// Fetch data from the API
async function fetchAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function acceptData(first_name, last_name) {
  try {
    // Check if first_name and last_name are not null
    if (!first_name || !last_name) {
      return;
    }

    // Create a new data object
    const newData = {
      first_name: first_name,
      last_name: last_name,
    };
  } catch (error) {
    console.error("Error accepting data:", error);
  }
}

async function deleteDataFromServer(id) {
  const url = `http://localhost:8000/api/users/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete data from server");
    }

    console.log("Data deleted from server successfully");
  } catch (error) {
    console.error("Error deleting data from server:", error);
    throw error; // Rethrow the error to handle it outside this function if needed
  }
}

// Create HTML elements based on user data
function createData(userDataArray) {
  userDataArray.forEach((userData) => {
    if (userData && userData.id && userData.first_name && userData.last_name) {
      const cardOutput = `
        <div class="card">
          <img src="movie-poster.webp">
          <h2 class="edit-first-name">${userData.first_name}</h2>
          <p class="edit-last-name">${userData.last_name}</p>
          <div id="crudBtn">
            <a href="edit.html?first_name=${encodeURIComponent(
              userData.first_name
            )}&last_name=${encodeURIComponent(userData.last_name)}&id=${encodeURIComponent(userData.id)}">
              <button class="edit-btn"><i class="fa fa-edit" style="font-size:24px;color:white"></i></button>
            </a>
            <button class="delete-btn"><i class="fa fa-trash-o" style="font-size:24px;color:white"></i></button>
          </div>
        </div>
      `;

      const card = document.createElement("div");
      card.innerHTML = cardOutput;
      container.appendChild(card);

      const deleteBtn = card.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", async () => {
        try {
          await deleteDataFromServer(userData.id);
          card.remove();
        } catch (error) {
          console.error("Error deleting data:", error);
        }
      });
    }
  });
}

// Render data for a specific page
async function renderDataForPage(pageNumber) {
  container.innerHTML = "";
  container.innerHTML += `
    <div class="page-heading">
      <h1> My Movies
        <a href="create.html" id="movieLink">
          <img src="add-white.svg">
        </a>
      </h1>
      <p id="logoutPara">
        Log Out
        <a href="logout.html">
          <img src="logout-white.svg">
        </a>
      </p> 
    </div>
  `;

  try {
    const apiData = await fetchAPI(url);
    if (!apiData) {
      return;
    }

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Check if apiData is an array with a data property
    const paginatedData = Array.isArray(apiData.data)
      ? apiData.data.slice(startIndex, endIndex)
      : apiData.slice(startIndex, endIndex);

    // Render paginated data on the UI
    createData(paginatedData);
    totalPages = Math.ceil(
      (Array.isArray(apiData.data) ? apiData.data.length : apiData.length) /
        itemsPerPage
    );

    updatePaginationButtonsState();
  } catch (error) {
    console.error("Error rendering data:", error);
  }
}

// Handle pagination button clicks
function handlePaginationClick(event) {
  event.preventDefault();

  const target = event.target;
  if (target.tagName === "BUTTON") {
    const pageNumber = parseInt(target.dataset.page);
    if (!isNaN(pageNumber)) {
      currentPage = pageNumber;
      renderDataForPage(currentPage);
    } else if (target.dataset.page === "prev" && currentPage > 1) {
      currentPage--;
      renderDataForPage(currentPage);
    } else if (target.dataset.page === "next" && currentPage < totalPages) {
      currentPage++;
      renderDataForPage(currentPage);
    }
  }
}

// Update pagination buttons state
function updatePaginationButtonsState() {
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

// Initialize pagination buttons
async function initPaginationButtons() {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  try {
    const apiData = await fetchAPI(url);
    if (!apiData) {
      return;
    }

    totalPages = Math.ceil(apiData.length / itemsPerPage);

    paginationContainer.addEventListener("click", function (event) {
      handlePaginationClick(event);
    });

    const prevButton = document.createElement("button");
    prevButton.textContent = "Prev";
    prevButton.dataset.page = "prev";
    prevButton.classList.add("prev");
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.dataset.page = i;
      paginationContainer.appendChild(button);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.dataset.page = "next";
    nextButton.classList.add("next");
    paginationContainer.appendChild(nextButton);

    // Update pagination buttons state
    updatePaginationButtonsState();
  } catch (error) {
    console.error("Error initializing page:", error);
  }
}

// Initialize the page
async function initializePage() {
  try {
    apiData = await fetchAPI(url);
    if (!apiData) {
      return;
    }
    acceptData(firstName, lastName);
    initPaginationButtons();
    renderDataForPage(currentPage);
  } catch (error) {
    console.error("Error initializing page:", error);
  }
}
initializePage();

var key = localStorage.getItem("code");

if (key === "secret") {
} else {
  window.location.href = "signIn.html";
}
