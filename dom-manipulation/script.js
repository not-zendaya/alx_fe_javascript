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
    text: "Don't let yesterday take up too much of today.",
    category: "Motivation",
  },
  {
    text: "You learn more from failure than from success.",
    category: "Wisdom",
  },
];

let lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
if (lastViewedQuote) {
  document.getElementById("quoteDisplay").textContent = lastViewedQuote;
}

populateCategories();
restoreLastFilter();
filterQuotes();

function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];
  const select = document.getElementById("categoryFilter");
  select.innerHTML = categories
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join("");
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  if (filtered.length > 0) {
    const randomQuote =
      filtered[Math.floor(Math.random() * filtered.length)].text;
    document.getElementById("quoteDisplay").textContent = randomQuote;
    sessionStorage.setItem("lastViewedQuote", randomQuote);
  } else {
    document.getElementById("quoteDisplay").textContent =
      "No quotes in this category.";
  }
}

function restoreLastFilter() {
  const savedCategory = localStorage.getItem("lastSelectedCategory");
  if (savedCategory) {
    document.getElementById("categoryFilter").value = savedCategory;
  }
}

function showRandomQuote() {
  filterQuotes();
}

function createAddQuoteForm() {
  const form = document.createElement("form");
  form.innerHTML = `
        <input type="text" id="newQuoteText" placeholder="Enter quote" required />
        <input type="text" id="newQuoteCategory" placeholder="Enter category" required />
        <button type="submit">Add</button>
    `;
  form.onsubmit = function (e) {
    e.preventDefault();
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();
    if (text && category) {
      addQuote(text, category);
      form.remove();
    }
  };
  document.body.appendChild(form);
}

function addQuote(text, category) {
  quotes.push({ text, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  filterQuotes();
}

function exportQuotes() {
  const data = JSON.stringify(quotes);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importQuotes() {
  const fileInput = document.getElementById("importFile");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        filterQuotes();
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
}
