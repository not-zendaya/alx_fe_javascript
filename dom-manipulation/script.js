// Add at the very top with the other storage keys
const CATEGORY_KEY = "dq_last_category";

// Modify updateCategoryOptions to restore saved category
function updateCategoryOptions() {
  const cats = Array.from(new Set(quotes.map((q) => q.category))).sort((a, b) =>
    a.localeCompare(b)
  );
  categorySelect.innerHTML = "";
  const allOpt = document.createElement("option");
  allOpt.value = "ALL";
  allOpt.textContent = "All Categories";
  categorySelect.appendChild(allOpt);
  cats.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });

  // Restore last selected category from storage (if exists)
  const savedCat = localStorage.getItem(CATEGORY_KEY);
  if (
    savedCat &&
    [...categorySelect.options].some((o) => o.value === savedCat)
  ) {
    categorySelect.value = savedCat;
  }
}

// Modify renderQuoteList to filter based on category
function renderQuoteList() {
  quotesList.innerHTML = "";
  let filtered = quotes;
  const selected = categorySelect.value;
  if (selected !== "ALL") {
    filtered = quotes.filter((q) => q.category === selected);
  }

  if (filtered.length === 0) {
    quotesList.innerHTML =
      "<em>No quotes yet for this category. Add one using the form above.</em>";
    return;
  }

  filtered.forEach((q) => {
    const card = document.createElement("div");
    card.className = "quote-card";

    const p = document.createElement("p");
    p.textContent = `"${q.text}"`;
    card.appendChild(p);

    const cat = document.createElement("div");
    cat.className = "cat";
    cat.textContent = q.category;
    card.appendChild(cat);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      removeQuoteById(q.id);
    });

    card.appendChild(removeBtn);
    quotesList.appendChild(card);
  });
}

// Save category selection when user changes it
categorySelect.addEventListener("change", () => {
  localStorage.setItem(CATEGORY_KEY, categorySelect.value);
  renderQuoteList();
  // Optional: immediately show a quote in the chosen category
  showRandomQuote();
});

// In addBtn click handler inside createAddQuoteForm()
// after updateCategoryOptions();
updateCategoryOptions();
renderQuoteList();
