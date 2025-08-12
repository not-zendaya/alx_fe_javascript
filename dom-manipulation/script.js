// Quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The best way to get started is to quit talking and begin doing.",
    category: "Motivation",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  {
    text: "Do not let what you cannot do interfere with what you can do.",
    category: "Inspiration",
  },
];

// Display saved category filter
const savedCategory = localStorage.getItem("selectedCategory") || "all";
document.getElementById("categoryFilter").value = savedCategory;

// Populate categories dynamically
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map((q) => q.category))];

  // Clear existing except "all"
  categorySelect.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  categorySelect.value = savedCategory; // Restore last filter
}

// Filter quotes based on selected category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  displayQuotes(selected);
}

// Display quotes in the display area
function displayQuotes(category = "all") {
  const display = document.getElementById("quoteDisplay");
  display.innerHTML = "";

  const filtered =
    category === "all" ? quotes : quotes.filter((q) => q.category === category);

  if (filtered.length === 0) {
    display.textContent = "No quotes in this category.";
    return;
  }

  filtered.forEach((q) => {
    const div = document.createElement("div");
    div.className = "quote-item";
    div.textContent = `"${q.text}" — ${q.category}`;
    display.appendChild(div);
  });
}

// Add new quote
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));

  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";

  populateCategories();
  filterQuotes();
}

// Export quotes
function exportQuotes() {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(quotes, null, 2));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Init
populateCategories();
displayQuotes(savedCategory);
