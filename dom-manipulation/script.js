document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const categorySelect = document.getElementById("categorySelect");
  const addQuoteBtn = document.getElementById("addQuoteBtn");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");

  // Array of quote objects
  let quotes = [
    {
      text: "The journey of a thousand miles begins with a single step.",
      category: "Motivation",
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      category: "Life",
    },
    {
      text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
      category: "Inspiration",
    },
    { text: "Happiness depends upon ourselves.", category: "Happiness" },
  ];

  // Populate category dropdown
  function updateCategoryOptions() {
    const categories = [...new Set(quotes.map((q) => q.category))];
    categorySelect.innerHTML = "";
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  // Show a random quote from selected category
  function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    const filteredQuotes = quotes.filter(
      (q) => q.category === selectedCategory
    );
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const randomQuote = filteredQuotes[randomIndex];
      quoteDisplay.innerHTML = `"${randomQuote.text}"<div class="quote-category">— ${randomQuote.category}</div>`;
    } else {
      quoteDisplay.innerHTML = "<em>No quotes found for this category.</em>";
    }
  }

  // Add a new quote dynamically
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      newQuoteText.value = "";
      newQuoteCategory.value = "";
      updateCategoryOptions();
      alert("Quote added successfully!");
    } else {
      alert("Please enter both a quote and a category.");
    }
  }

  // Event listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);

  // Initial setup
  updateCategoryOptions();
  showRandomQuote();
});
