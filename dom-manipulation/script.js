document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const categoryFilter = document.getElementById("categoryFilter");
  const notificationBar = document.getElementById("notificationBar");

  let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
  let selectedCategory = "all";

  // Show a random quote
  function showRandomQuote() {
    let filteredQuotes =
      selectedCategory === "all"
        ? quotes
        : quotes.filter((q) => q.category === selectedCategory);

    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const { text, category } = filteredQuotes[randomIndex];
      quoteDisplay.innerHTML = `"${text}"`;
      document.getElementById(
        "quoteMeta"
      ).textContent = `Category: ${category}`;
    } else {
      quoteDisplay.innerHTML = "No quotes available in this category.";
      document.getElementById("quoteMeta").textContent = "";
    }
  }

  // Populate dropdown with categories
  function populateCategories() {
    const categories = [...new Set(quotes.map((q) => q.category))];
    categoryFilter.innerHTML =
      `<option value="all">All</option>` +
      categories
        .map((cat) => `<option value="${cat}">${cat}</option>`)
        .join("");
  }

  categoryFilter.addEventListener("change", (e) => {
    selectedCategory = e.target.value;
    showRandomQuote();
  });

  // Sync with server simulation
  async function syncWithServer() {
    try {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5"
      );
      const serverData = await res.json();

      let serverQuotes = serverData.map((item) => ({
        id: item.id,
        text: item.title,
        category: "Server",
      }));

      let conflicts = 0;
      let merged = [...quotes];

      serverQuotes.forEach((sq) => {
        let localIndex = merged.findIndex((lq) => lq.id === sq.id);
        if (localIndex > -1) {
          if (merged[localIndex].text !== sq.text) {
            merged[localIndex] = sq; // Server wins
            conflicts++;
          }
        } else {
          merged.push(sq);
        }
      });

      if (conflicts > 0) {
        showNotification(`${conflicts} conflicts resolved — server data used.`);
      } else if (merged.length > quotes.length) {
        showNotification("New quotes fetched from server.");
      }

      quotes = merged;
      localStorage.setItem("quotes", JSON.stringify(quotes));
      populateCategories();
    } catch (err) {
      console.error("Sync failed", err);
    }
  }

  function showNotification(message) {
    notificationBar.textContent = message;
    notificationBar.style.display = "block";
    setTimeout(() => (notificationBar.style.display = "none"), 4000);
  }

  document
    .getElementById("newQuoteBtn")
    .addEventListener("click", showRandomQuote);

  // Initialize
  populateCategories();
  showRandomQuote();

  // Sync every 15s
  setInterval(syncWithServer, 15000);
});
