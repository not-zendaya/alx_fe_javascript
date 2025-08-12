document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const categorySelect = document.getElementById("categorySelect");

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

  // Create the form UI and handle adding quotes
  function createAddQuoteForm() {
    const formContainer = document.createElement("div");

    const heading = document.createElement("h3");
    heading.textContent = "Add a New Quote";

    const quoteInput = document.createElement("input");
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Quote";

    // Handle adding quote when button is clicked
    addBtn.addEventListener("click", () => {
      const text = quoteInput.value.trim();
      const category = categoryInput.value.trim();

      if (text && category) {
        quotes.push({ text, category });
        quoteInput.value = "";
        categoryInput.value = "";
        updateCategoryOptions();
        alert("Quote added successfully!");
      } else {
        alert("Please enter both a quote and a category.");
      }
    });

    formContainer.appendChild(heading);
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addBtn);

    document.querySelector(".container").appendChild(formContainer);
  }

  // Event listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);

  // Initial setup
  updateCategoryOptions();
  showRandomQuote();
  createAddQuoteForm(); // Create form dynamically
});
