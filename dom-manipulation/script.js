// Advanced DOM Manipulation Class
class DynamicQuoteGenerator {
  constructor() {
    // Quote data structure with various categories
    this.quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "motivation",
      },
      {
        text: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon",
        category: "life",
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        category: "dreams",
      },
      {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle",
        category: "wisdom",
      },
      {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
        category: "motivation",
      },
      {
        text: "Don't let yesterday take up too much of today.",
        author: "Will Rogers",
        category: "life",
      },
      {
        text: "You learn more from failure than from success.",
        author: "Unknown",
        category: "wisdom",
      },
      {
        text: "If you are working on something exciting, you don't have to be pushed.",
        author: "Steve Jobs",
        category: "motivation",
      },
      {
        text: "All our dreams can come true if we have the courage to pursue them.",
        author: "Walt Disney",
        category: "dreams",
      },
      {
        text: "The real test is not whether you avoid this failure, but whether you let it harden you.",
        author: "Cheryl Strayed",
        category: "wisdom",
      },
    ];

    this.currentCategory = "all";
    this.displayedQuotes = new Set(); // Track shown quotes to avoid repeats

    // DOM element references
    this.quoteDisplay = document.getElementById("quoteDisplay");
    this.newQuoteBtn = document.getElementById("newQuote");
    this.categoryFilters = document.getElementById("categoryFilters");
    this.addQuoteFormContainer = document.getElementById("addQuoteForm");
    this.statsContainer = document.getElementById("statsContainer");

    this.init();
  }

  // Initialize the application
  init() {
    this.createCategoryFilters();
    this.createAddQuoteForm();
    this.updateStats();
    this.attachEventListeners();
    console.log(
      "Dynamic Quote Generator initialized with advanced DOM manipulation"
    );
  }

  // Advanced DOM Creation: Category filter buttons
  createCategoryFilters() {
    // Get unique categories from quotes
    const categories = [
      "all",
      ...new Set(this.quotes.map((quote) => quote.category)),
    ];

    // Clear existing filters
    this.categoryFilters.innerHTML = "";

    categories.forEach((category) => {
      // Create button element using advanced DOM methods
      const button = this.createElement("button", {
        className: `category-btn ${
          category === this.currentCategory ? "active" : ""
        }`,
        textContent: this.capitalizeFirst(category),
        dataset: { category: category },
      });

      // Add click event with closure to maintain category context
      button.addEventListener("click", (e) => {
        this.filterByCategory(category);
        this.updateActiveFilter(e.target);
      });

      // Advanced DOM manipulation: appendChild with animation
      this.categoryFilters.appendChild(button);

      // Add slide-in animation
      setTimeout(
        () => button.classList.add("slide-in"),
        categories.indexOf(category) * 100
      );
    });
  }

  // Advanced DOM Creation: Dynamic form generation
  createAddQuoteForm() {
    const formHTML = `
                    <div class="input-group">
                        <label for="newQuoteText">Quote Text</label>
                        <textarea id="newQuoteText" rows="3" placeholder="Enter an inspiring quote..."></textarea>
                    </div>
                    <div class="input-group">
                        <label for="newQuoteAuthor">Author</label>
                        <input id="newQuoteAuthor" type="text" placeholder="Who said this quote?" />
                    </div>
                    <div class="input-group">
                        <label for="newQuoteCategory">Category</label>
                        <input id="newQuoteCategory" type="text" placeholder="e.g., motivation, wisdom, life" />
                    </div>
                    <button id="addQuoteBtn" class="primary-btn">📝 Add Quote</button>
                    <div id="formMessages"></div>
                `;

    this.addQuoteFormContainer.innerHTML = formHTML;

    // Advanced event delegation
    this.addQuoteFormContainer.addEventListener("click", (e) => {
      if (e.target.id === "addQuoteBtn") {
        this.addQuote();
      }
    });

    // Add keyboard shortcuts
    this.addQuoteFormContainer.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        this.addQuote();
      }
    });
  }

  // Advanced DOM Manipulation: Show random quote with animations
  showRandomQuote() {
    const filteredQuotes =
      this.currentCategory === "all"
        ? this.quotes
        : this.quotes.filter(
            (quote) => quote.category === this.currentCategory
          );

    if (filteredQuotes.length === 0) {
      this.displayMessage("No quotes available in this category.", "error");
      return;
    }

    // Advanced selection: avoid repeating recent quotes
    let availableQuotes = filteredQuotes.filter(
      (quote) => !this.displayedQuotes.has(quote.text)
    );

    // Reset displayed quotes if we've shown them all
    if (availableQuotes.length === 0) {
      this.displayedQuotes.clear();
      availableQuotes = filteredQuotes;
    }

    const randomQuote =
      availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
    this.displayedQuotes.add(randomQuote.text);

    // Advanced DOM manipulation with smooth transitions
    this.animateQuoteChange(randomQuote);
  }

  // Advanced animation handling
  animateQuoteChange(quote) {
    // Fade out current quote
    this.quoteDisplay.style.opacity = "0";
    this.quoteDisplay.style.transform = "translateY(20px)";

    setTimeout(() => {
      // Create new quote elements with advanced DOM techniques
      this.quoteDisplay.innerHTML = "";

      const quoteTextEl = this.createElement("div", {
        className: "quote-text",
        textContent: quote.text,
      });

      const quoteAuthorEl = this.createElement("div", {
        className: "quote-author",
        textContent: `— ${quote.author}`,
      });

      const quoteCategoryEl = this.createElement("span", {
        className: "quote-category",
        textContent: this.capitalizeFirst(quote.category),
      });

      // Advanced DOM assembly
      this.quoteDisplay.appendChild(quoteTextEl);
      this.quoteDisplay.appendChild(quoteAuthorEl);
      this.quoteDisplay.appendChild(quoteCategoryEl);

      // Fade in new quote
      this.quoteDisplay.style.opacity = "1";
      this.quoteDisplay.style.transform = "translateY(0)";
      this.quoteDisplay.classList.add("fade-in");
    }, 300);
  }

  // Advanced form processing and validation
  addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteAuthor = document
      .getElementById("newQuoteAuthor")
      .value.trim();
    const newQuoteCategory = document
      .getElementById("newQuoteCategory")
      .value.trim()
      .toLowerCase();

    // Advanced validation with specific error messages
    const validationResults = this.validateQuoteInput(
      newQuoteText,
      newQuoteAuthor,
      newQuoteCategory
    );

    if (!validationResults.isValid) {
      this.displayFormMessage(validationResults.message, "error");
      return;
    }

    // Create new quote object
    const newQuote = {
      text: newQuoteText,
      author: newQuoteAuthor,
      category: newQuoteCategory,
    };

    // Add to quotes array
    this.quotes.push(newQuote);

    // Advanced DOM updates
    this.updateAfterQuoteAdded(newQuote);

    // Clear form with animation
    this.clearFormWithAnimation();

    this.displayFormMessage("Quote added successfully! 🎉", "success");
  }

  // Advanced validation with detailed feedback
  validateQuoteInput(text, author, category) {
    if (!text) return { isValid: false, message: "Please enter a quote text." };
    if (!author)
      return { isValid: false, message: "Please enter the author name." };
    if (!category)
      return { isValid: false, message: "Please enter a category." };
    if (text.length < 10)
      return {
        isValid: false,
        message: "Quote text should be at least 10 characters long.",
      };

    // Check for duplicate quotes
    const isDuplicate = this.quotes.some(
      (quote) => quote.text.toLowerCase() === text.toLowerCase()
    );

    if (isDuplicate)
      return {
        isValid: false,
        message: "This quote already exists in the collection.",
      };

    return { isValid: true };
  }

  // Advanced DOM updates after adding quote
  updateAfterQuoteAdded(newQuote) {
    // Recreate category filters if new category was added
    const existingCategories = new Set(this.quotes.map((q) => q.category));
    this.createCategoryFilters();

    // Update statistics
    this.updateStats();

    // If viewing 'all' or the new quote's category, show it
    if (
      this.currentCategory === "all" ||
      this.currentCategory === newQuote.category
    ) {
      this.animateQuoteChange(newQuote);
    }
  }

  // Advanced statistics calculation and display
  updateStats() {
    const categories = new Set(this.quotes.map((quote) => quote.category));
    const stats = [
      { label: "Total Quotes", value: this.quotes.length },
      { label: "Categories", value: categories.size },
      {
        label: "Authors",
        value: new Set(this.quotes.map((q) => q.author)).size,
      },
    ];

    this.statsContainer.innerHTML = "";

    stats.forEach((stat, index) => {
      const statElement = this.createElement("div", {
        className: "stat-item",
      });

      const numberEl = this.createElement("div", {
        className: "stat-number",
        textContent: stat.value,
      });

      const labelEl = this.createElement("div", {
        className: "stat-label",
        textContent: stat.label,
      });

      statElement.appendChild(numberEl);
      statElement.appendChild(labelEl);
      this.statsContainer.appendChild(statElement);

      // Staggered animation
      setTimeout(() => statElement.classList.add("fade-in"), index * 100);
    });
  }

  // Advanced event handling
  attachEventListeners() {
    // Primary quote button with advanced event handling
    this.newQuoteBtn.addEventListener("click", () => {
      this.showRandomQuote();
      this.addButtonClickAnimation(this.newQuoteBtn);
    });

    // Advanced keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === " " && !e.target.matches("input, textarea")) {
        e.preventDefault();
        this.showRandomQuote();
      }
    });

    // Advanced window resize handling
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  // Utility: Advanced element creation with options
  createElement(tag, options = {}) {
    const element = document.createElement(tag);

    Object.entries(options).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "textContent") {
        element.textContent = value;
      } else if (key === "innerHTML") {
        element.innerHTML = value;
      } else if (key === "dataset") {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element.setAttribute(key, value);
      }
    });

    return element;
  }

  // Advanced category filtering
  filterByCategory(category) {
    this.currentCategory = category;
    this.displayedQuotes.clear(); // Reset shown quotes for new category
    console.log(`Filtering quotes by category: ${category}`);
  }

  // Advanced UI state management
  updateActiveFilter(activeButton) {
    // Remove active class from all buttons
    this.categoryFilters.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to clicked button
    activeButton.classList.add("active");
  }

  // Advanced form management
  clearFormWithAnimation() {
    const inputs = ["newQuoteText", "newQuoteAuthor", "newQuoteCategory"];
    inputs.forEach((inputId, index) => {
      const input = document.getElementById(inputId);
      setTimeout(() => {
        input.style.transform = "scale(0.95)";
        setTimeout(() => {
          input.value = "";
          input.style.transform = "scale(1)";
        }, 100);
      }, index * 50);
    });
  }

  // Advanced message display system
  displayFormMessage(message, type) {
    const messagesContainer = document.getElementById("formMessages");
    messagesContainer.innerHTML = "";

    const messageEl = this.createElement("div", {
      className: `${type}-message`,
      textContent: message,
    });

    messagesContainer.appendChild(messageEl);

    // Auto-hide success messages
    if (type === "success") {
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.style.opacity = "0";
          setTimeout(() => messagesContainer.removeChild(messageEl), 300);
        }
      }, 3000);
    }
  }

  // Advanced button animation
  addButtonClickAnimation(button) {
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);
  }

  // Utility functions
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  displayMessage(message, type) {
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  handleResize() {
    // Advanced responsive handling could go here
    console.log("Window resized, adjusting layout if needed");
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Create instance of our advanced quote generator
  window.quoteGenerator = new DynamicQuoteGenerator();

  console.log("Advanced Dynamic Quote Generator loaded successfully!");
  console.log(
    "Features: Category filtering, dynamic form creation, advanced animations, keyboard shortcuts"
  );
  console.log(
    "Try pressing SPACE to get a random quote, or CTRL+ENTER in the form to add a quote!"
  );
});

// Global functions for backward compatibility and external access
function showRandomQuote() {
  window.quoteGenerator?.showRandomQuote();
}

function addQuote() {
  window.quoteGenerator?.addQuote();
}
