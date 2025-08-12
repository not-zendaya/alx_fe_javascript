// ====== Local Storage Helpers ======
function getQuotes() {
  return JSON.parse(localStorage.getItem("quotes")) || [];
}

function saveQuotes(quotes) {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function getSelectedCategory() {
  return localStorage.getItem("selectedCategory") || "all";
}

function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

// ====== DOM Elements ======
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// ====== Populate Categories ======
function populateCategories() {
  const quotes = getQuotes();
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];

  categoryFilter.innerHTML = "";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = getSelectedCategory();
}

// ====== Filter and Display Quotes ======
function filterQuotes() {
  const quotes = getQuotes();
  const selectedCategory = getSelectedCategory();
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter((q) => q.category === selectedCategory);
  }

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
  } else {
    quoteDisplay.textContent = "No quotes available for this category.";
  }
}

// ====== Add Quote Form ======
function createAddQuoteForm() {
  const text = prompt("Enter the quote text:");
  const category = prompt("Enter the quote category:");
  if (text && category) {
    const quotes = getQuotes();
    quotes.push({ text, category });
    saveQuotes(quotes);
    populateCategories();
    filterQuotes();
  }
}

// ====== Export Quotes ======
function exportQuotes() {
  const quotes = getQuotes();
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ====== Server Simulation ======
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((data) => {
      // Simulate server data with quotes + categories
      return data.slice(0, 5).map((item) => ({
        text: item.title,
        category: ["inspiration", "humor", "life"][item.id % 3],
      }));
    });
}

function syncWithServer() {
  fetchQuotesFromServer().then((serverQuotes) => {
    const localQuotes = getQuotes();
    let updated = false;

    serverQuotes.forEach((serverQuote) => {
      if (
        !localQuotes.some(
          (q) =>
            q.text === serverQuote.text && q.category === serverQuote.category
        )
      ) {
        localQuotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes(localQuotes);
      populateCategories();
      filterQuotes();
      showNotification("Quotes updated from server.");
    }
  });

  // Simulate sending local quotes to server
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(getQuotes()),
  })
    .then((response) => response.json())
    .then((data) => console.log("Data synced to server:", data))
    .catch((error) => console.error("Error syncing with server:", error));
}

// ====== Notification ======
function showNotification(message) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// ====== Event Listeners ======
document.getElementById("newQuoteBtn").addEventListener("click", filterQuotes);
document
  .getElementById("addQuoteBtn")
  .addEventListener("click", createAddQuoteForm);
document
  .getElementById("exportQuotesBtn")
  .addEventListener("click", exportQuotes);

categoryFilter.addEventListener("change", (e) => {
  saveSelectedCategory(e.target.value);
  filterQuotes();
});

// ====== Init ======
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes();
  setInterval(syncWithServer, 10000); // Sync every 10s
});
