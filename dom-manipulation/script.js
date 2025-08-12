// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Storage keys
  const STORAGE_KEY = "dq_quotes_v1";
  const SESSION_KEY = "dq_last_viewed_id";

  // DOM refs
  const categorySelect = document.getElementById("categorySelect");
  const newQuoteBtn = document.getElementById("newQuote");
  const quoteDisplay = document.getElementById("quoteDisplay");
  const quoteMeta = document.getElementById("quoteMeta");
  const quotesList = document.getElementById("quotesList");
  const importFileInput = document.getElementById("importFile");
  const exportBtn = document.getElementById("exportBtn");
  const showLastBtn = document.getElementById("showLast");

  // In-memory quotes array
  let quotes = [];

  // --- Persistence helpers ---
  function saveQuotes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    } catch (err) {
      console.error("Failed to save quotes:", err);
      alert("Could not save quotes to localStorage.");
    }
  }

  function loadQuotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      return parsed;
    } catch (err) {
      console.warn("Failed to parse stored quotes:", err);
      return null;
    }
  }

  // Create a simple unique id
  function makeId() {
    return (
      Date.now().toString(36) +
      "-" +
      Math.floor(Math.random() * 1e6).toString(36)
    );
  }

  // --- UI update helpers ---
  function updateCategoryOptions() {
    const cats = Array.from(new Set(quotes.map((q) => q.category))).sort(
      (a, b) => a.localeCompare(b)
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
  }

  function renderQuoteList() {
    quotesList.innerHTML = "";
    if (quotes.length === 0) {
      quotesList.innerHTML =
        "<em>No quotes yet. Add one using the form above.</em>";
      return;
    }

    quotes.forEach((q) => {
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

  function displayQuote(quote) {
    if (!quote) {
      quoteDisplay.innerHTML = "<em>No quote to show.</em>";
      quoteMeta.textContent = "";
      return;
    }
    quoteDisplay.innerHTML = `"${quote.text}"`;
    quoteMeta.textContent = `Category: ${quote.category}`;
    // Save last viewed in session storage
    try {
      sessionStorage.setItem(SESSION_KEY, quote.id);
    } catch (e) {
      console.warn("Session save failed", e);
    }
  }

  // --- Core actions ---
  function showRandomQuote() {
    const selected = categorySelect.value;
    const pool =
      selected === "ALL"
        ? quotes
        : quotes.filter((q) => q.category === selected);
    if (!pool || pool.length === 0) {
      displayQuote(null);
      return;
    }
    const idx = Math.floor(Math.random() * pool.length);
    const chosen = pool[idx];
    displayQuote(chosen);
  }

  function removeQuoteById(id) {
    const before = quotes.length;
    quotes = quotes.filter((q) => q.id !== id);
    if (quotes.length !== before) {
      saveQuotes();
      updateCategoryOptions();
      renderQuoteList();
      // if removed quote was last viewed, clear session
      const last = sessionStorage.getItem(SESSION_KEY);
      if (last === id) sessionStorage.removeItem(SESSION_KEY);
    }
  }

  // createAddQuoteForm merges UI creation + add logic
  function createAddQuoteForm() {
    const anchor = document.getElementById("formAnchor");
    const wrapper = document.createElement("div");

    const heading = document.createElement("h3");
    heading.textContent = "Add a New Quote";
    wrapper.appendChild(heading);

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.placeholder = "Enter a new quote";
    textInput.style.width = "100%";
    textInput.style.marginBottom = "8px";
    wrapper.appendChild(textInput);

    const catInput = document.createElement("input");
    catInput.type = "text";
    catInput.placeholder = "Enter quote category (e.g. Motivation)";
    catInput.style.width = "100%";
    catInput.style.marginBottom = "8px";
    wrapper.appendChild(catInput);

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Quote";
    addBtn.className = "primary";
    wrapper.appendChild(addBtn);

    // handle Enter key inside the text input
    textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addBtn.click();
      }
    });
    catInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addBtn.click();
      }
    });

    addBtn.addEventListener("click", () => {
      const text = textInput.value.trim();
      const category = catInput.value.trim();
      if (!text || !category) {
        alert("Please enter both a quote and a category.");
        return;
      }
      const item = { id: makeId(), text, category };
      quotes.push(item);
      saveQuotes();
      updateCategoryOptions();
      renderQuoteList();
      textInput.value = "";
      catInput.value = "";
      // optionally display the newly added quote
      displayQuote(item);
    });

    anchor.appendChild(wrapper);
  }

  // --- Export & Import JSON ---
  function exportQuotes() {
    try {
      const blob = new Blob([JSON.stringify(quotes, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quotes.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed.");
    }
  }

  function importFromJsonFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        let imported = [];
        if (Array.isArray(parsed)) {
          imported = parsed;
        } else if (typeof parsed === "object" && parsed !== null) {
          // allow single object too
          imported = [parsed];
        } else {
          throw new Error("Invalid JSON structure. Expected array or object.");
        }

        const toAppend = [];
        for (const itm of imported) {
          if (
            !itm ||
            typeof itm.text !== "string" ||
            typeof itm.category !== "string"
          ) {
            // skip invalid entries
            console.warn("Skipping invalid item during import:", itm);
            continue;
          }
          const id = itm.id && typeof itm.id === "string" ? itm.id : makeId();
          toAppend.push({ id, text: itm.text, category: itm.category });
        }

        if (toAppend.length === 0) {
          alert("No valid quotes found in file.");
          return;
        }

        // Append and save
        quotes.push(...toAppend);
        saveQuotes();
        updateCategoryOptions();
        renderQuoteList();
        alert(`Imported ${toAppend.length} quote(s) successfully.`);
      } catch (err) {
        console.error("Import error", err);
        alert(
          "Failed to import JSON file. Make sure it contains an array of {text, category} objects."
        );
      }
    };
    reader.onerror = () => {
      alert("Failed to read file.");
    };
    reader.readAsText(file);
  }

  // --- Event listeners ---
  newQuoteBtn.addEventListener("click", showRandomQuote);
  exportBtn.addEventListener("click", exportQuotes);
  importFileInput.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importFromJsonFile(f);
    // clear the input so the same file can be uploaded again if needed
    e.target.value = "";
  });
  showLastBtn.addEventListener("click", () => {
    const lastId = sessionStorage.getItem(SESSION_KEY);
    if (!lastId) {
      alert("No last viewed quote in this session.");
      return;
    }
    const q = quotes.find((x) => x.id === lastId);
    if (!q) {
      alert("Last viewed quote no longer exists.");
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }
    displayQuote(q);
  });

  categorySelect.addEventListener("change", () => {
    // optional: when category changes, show a random quote in that category
    // showRandomQuote();
  });

  // --- Initialization ---
  (function init() {
    const stored = loadQuotes();
    if (stored && Array.isArray(stored) && stored.length > 0) {
      quotes = stored;
    } else {
      // default starter array
      quotes = [
        {
          id: makeId(),
          text: "The journey of a thousand miles begins with a single step.",
          category: "Motivation",
        },
        {
          id: makeId(),
          text: "Life is what happens when you're busy making other plans.",
          category: "Life",
        },
        {
          id: makeId(),
          text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
          category: "Inspiration",
        },
        {
          id: makeId(),
          text: "Happiness depends upon ourselves.",
          category: "Happiness",
        },
      ];
      saveQuotes();
    }

    updateCategoryOptions();
    createAddQuoteForm();
    renderQuoteList();

    // show last viewed if present otherwise show a random quote
    const lastId = sessionStorage.getItem(SESSION_KEY);
    if (lastId) {
      const last = quotes.find((q) => q.id === lastId);
      if (last) {
        displayQuote(last);
        return;
      }
    }
    // default visible quote
    showRandomQuote();
  })();
});
