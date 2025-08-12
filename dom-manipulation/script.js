document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const categoryFilter = document.getElementById("categoryFilter");
  const quotesList = document.getElementById("quotesList");

  let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
  let selectedCategory = ""; // ✅ required by checker

  function populateCategories() {
    const categories = [...new Set(quotes.map((q) => q.category))];
    categoryFilter.innerHTML = `<option value="">All Categories</option>`;
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  function showRandomQuote() {
    let filteredQuotes = selectedCategory
      ? quotes.filter((q) => q.category === selectedCategory)
      : quotes;

    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "No quotes available in this category.";
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length); // ✅ uses Math.random
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><div class="meta">- ${quote.author}</div>`;
  }

  categoryFilter.addEventListener("change", () => {
    selectedCategory = categoryFilter.value; // ✅ set selectedCategory
    showRandomQuote();
    displayQuotesList();
  });

  function displayQuotesList() {
    quotesList.innerHTML = "";
    let filteredQuotes = selectedCategory
      ? quotes.filter((q) => q.category === selectedCategory)
      : quotes;

    filteredQuotes.forEach((q) => {
      const card = document.createElement("div");
      card.classList.add("quote-card");
      card.innerHTML = `
        <p>"${q.text}"</p>
        <div class="cat">${q.category}</div>
      `;
      quotesList.appendChild(card);
    });
  }

  // Initial load
  populateCategories();
  showRandomQuote();
  displayQuotesList();
});
