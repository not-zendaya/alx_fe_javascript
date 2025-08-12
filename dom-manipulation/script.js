// Retrieve quotes from localStorage or initialize with default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The best way to get started is to quit talking and begin doing.",
    category: "Motivation",
  },
  {
    text: "Don’t let yesterday take up too much of today.",
    category: "Inspiration",
  },
  {
    text: "It’s not whether you get knocked down, it’s whether you get up.",
    category: "Perseverance",
  },
];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate quotes in the DOM
function displayQuotes(filteredCategory = "all") {
  const quoteList = document.getElementById("quoteList");
  quoteList.innerHTML = "";

  let filteredQuotes =
    filteredCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === filteredCategory);

  filteredQuotes.forEach((quote) => {
    const li = document.createElement("li");
    li.textContent = `${quote.text} (${quote.category})`;
    quoteList.appendChild(li);
  });
}

// Function to populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  let categories = [...new Set(quotes.map((q) => q.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from localStorage
  const lastCategory = localStorage.getItem("selectedCategory");
  if (lastCategory) {
    categoryFilter.value = lastCategory;
    displayQuotes(lastCategory);
  }
}

// Function to filter quotes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayQuotes(selectedCategory);
}

// Function to add a new quote
function createAddQuoteForm() {
  const quoteInput = document.getElementById("newQuote").value.trim();
  const categoryInput = document.getElementById("newCategory").value.trim();

  if (quoteInput && categoryInput) {
    quotes.push({ text: quoteInput, category: categoryInput });
    saveQuotes();
    populateCategories();
    filterQuotes();
    document.getElementById("newQuote").value = "";
    document.getElementById("newCategory").value = "";
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  displayQuotes(localStorage.getItem("selectedCategory") || "all");
});
