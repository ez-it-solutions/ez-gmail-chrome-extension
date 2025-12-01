// Ez Gmail - Gmail Navigation System
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Advanced page and date navigation for Gmail

class GmailNavigation {
  constructor(settings) {
    this.settings = settings;
    this.currentPage = this.getCurrentPage();
    this.totalPages = null;
    this.navigationBar = null;
    this.observer = null; // Store observer reference to prevent multiple instances
    this.reinitTimeout = null; // Store timeout reference for cleanup
  }
  
  // Get current page from URL
  getCurrentPage() {
    // Check for page number in various Gmail views
    const hash = window.location.hash;
    
    // Inbox: #inbox/p2
    let match = hash.match(/#inbox\/p(\d+)/);
    if (match) return parseInt(match[1]);
    
    // Search: #search/query/p2
    match = hash.match(/#search\/[^/]+\/p(\d+)/);
    if (match) return parseInt(match[1]);
    
    // Other views: #sent/p2, #spam/p2, etc.
    match = hash.match(/\/p(\d+)/);
    if (match) return parseInt(match[1]);
    
    return 1;
  }
  
  // Estimate total pages (Gmail doesn't provide this directly)
  estimateTotalPages() {
    // Try to find email count indicators
    const countElement = document.querySelector('[data-tooltip*="of"]');
    if (countElement) {
      const text = countElement.textContent;
      const match = text.match(/(\d+)[\s-]+(\d+)\s+of\s+(\d+)/);
      if (match) {
        const total = parseInt(match[3]);
        const itemsPerPage = this.settings.navigation.itemsPerPage;
        return Math.ceil(total / itemsPerPage);
      }
    }
    return null;
  }
  
  // Navigate to specific page
  goToPage(pageNumber) {
    if (pageNumber < 1) pageNumber = 1;
    
    const hash = window.location.hash;
    const baseUrl = window.location.origin + window.location.pathname;
    let newUrl;
    
    // Check if we're CURRENTLY in a search view (not just if hash contains search)
    // We need to check the actual current location, not old cached values
    const currentHash = window.location.hash;
    
    if (currentHash.startsWith('#search/')) {
      // For search results, keep the search query but update page
      // Format: #search/query/p2
      const searchMatch = currentHash.match(/#search\/([^/]+)/);
      if (searchMatch) {
        const searchQuery = searchMatch[1];
        // Remove any existing page number from the query
        const cleanQuery = searchQuery.replace(/\/p\d+$/, '');
        newUrl = `${baseUrl}#search/${cleanQuery}/p${pageNumber}`;
      } else {
        // Fallback if search format is unexpected
        newUrl = `${baseUrl}${currentHash}/p${pageNumber}`;
      }
    } else {
      // For inbox and other views, build clean URL without any query params
      const currentView = currentHash.split('/')[0].replace('#', '') || 'inbox';
      newUrl = `${baseUrl}#${currentView}/p${pageNumber}`;
    }
    
    // Navigate to the page
    window.location.href = newUrl;
    this.currentPage = pageNumber;
    this.updateNavigationBar();
  }
  
  // Navigate to next page
  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
  
  // Navigate to previous page
  prevPage() {
    this.goToPage(this.currentPage - 1);
  }
  
  // Jump to first page
  firstPage() {
    this.goToPage(1);
  }
  
  // Jump to last page (if known)
  lastPage() {
    if (this.totalPages) {
      this.goToPage(this.totalPages);
    }
  }
  
  // Search emails by date
  searchByDate(date, mode = 'single') {
    let searchQuery;
    
    if (mode === 'single') {
      // Single day search - search for emails ON this specific date
      // Gmail uses: after:DATE before:DATE+1 to get emails on DATE
      // Parse date string to avoid timezone issues
      const targetDate = this.parseDateString(date);
      const afterDate = new Date(targetDate);
      const beforeDate = new Date(targetDate);
      beforeDate.setDate(beforeDate.getDate() + 1);
      
      const afterStr = this.formatDateForSearch(afterDate);
      const beforeStr = this.formatDateForSearch(beforeDate);
      
      searchQuery = `after:${afterStr} before:${beforeStr}`;
    } else if (mode === 'after') {
      // From date onwards
      const targetDate = this.parseDateString(date);
      const dateStr = this.formatDateForSearch(targetDate);
      searchQuery = `after:${dateStr}`;
    } else if (mode === 'before') {
      // Before date
      const targetDate = this.parseDateString(date);
      const dateStr = this.formatDateForSearch(targetDate);
      searchQuery = `before:${dateStr}`;
    }
    
    // Use Gmail's advanced search URL format
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedQuery = encodeURIComponent(searchQuery);
    const advancedSearchUrl = `${baseUrl}?q=${encodedQuery}#search/${encodedQuery}`;
    
    // Navigate to search results
    window.location.href = advancedSearchUrl;
  }
  
  // Parse date string to avoid timezone issues
  // Input: "2025-08-01" or Date object
  // Output: Date object at local midnight
  parseDateString(dateInput) {
    if (dateInput instanceof Date) {
      return dateInput;
    }
    
    // Parse YYYY-MM-DD format to avoid UTC interpretation
    const parts = String(dateInput).split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const day = parseInt(parts[2]);
      return new Date(year, month, day);
    }
    
    // Fallback to standard parsing
    return new Date(dateInput);
  }
  
  // Format date for Gmail search (YYYY/MM/DD)
  formatDateForSearch(date) {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
  
  // Create navigation bar
  createNavigationBar() {
    if (!this.settings.navigation.enabled) return;
    
    const nav = document.createElement('div');
    nav.id = 'ez-gmail-navigation';
    nav.className = 'ez-gmail-nav-bar';
    
    // Force initial display style to ensure proper rendering
    nav.style.cssText = 'display: block !important; visibility: visible !important;';
    
    nav.innerHTML = `
      <div class="ez-nav-container">
        <!-- Left Section: Navigation Controls -->
        <div class="ez-nav-left">
          <!-- First/Prev Buttons -->
          <div class="ez-nav-section">
            <button class="ez-nav-btn" id="ez-nav-first" title="First Page">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </button>
            <button class="ez-nav-btn" id="ez-nav-prev" title="Previous Page">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>
          
          <!-- Page Numbers -->
          <div class="ez-nav-section ez-nav-pages" id="ez-nav-pages"></div>
          
          <!-- Next/Last Buttons -->
          <div class="ez-nav-section">
            <button class="ez-nav-btn" id="ez-nav-next" title="Next Page">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <button class="ez-nav-btn" id="ez-nav-last" title="Last Page">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </button>
          </div>
          
          <!-- Quick Jump -->
          <div class="ez-nav-section ez-nav-jump">
            <span class="ez-nav-label">Go to:</span>
            <input type="number" id="ez-nav-jump-input" placeholder="Page #" min="1" />
            <button class="ez-nav-btn-primary" id="ez-nav-jump-btn">Jump</button>
          </div>
        </div>
        
        <!-- Right Section: Date Jump -->
        <div class="ez-nav-right">
          <button class="ez-nav-btn-primary" id="ez-nav-date-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Jump to Date
          </button>
        </div>
      </div>
    `;
    
    this.navigationBar = nav;
    return nav;
  }
  
  // Generate page numbers
  generatePageNumbers() {
    const pagesContainer = document.getElementById('ez-nav-pages');
    if (!pagesContainer || !this.settings.navigation.showPageNumbers) return;
    
    pagesContainer.innerHTML = '';
    
    const current = this.currentPage;
    const max = this.totalPages || current + 20; // Show at least 20 more pages
    const maxVisible = this.settings.navigation.maxVisiblePages;
    const style = this.settings.navigation.paginationStyle;
    
    let pages = [];
    
    if (style === 'full') {
      // Show more pages around current
      const start = Math.max(1, current - Math.floor(maxVisible / 2));
      const end = Math.min(max, start + maxVisible - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < max) {
        if (end < max - 1) pages.push('...');
        pages.push(max);
      }
    } else if (style === 'compact') {
      pages = [1, '...', current - 1, current, current + 1, '...', max];
      pages = pages.filter((p, i, arr) => {
        if (typeof p === 'number') {
          return p >= 1 && p <= max && arr.indexOf(p) === i;
        }
        return true;
      });
    } else {
      // Minimal - just show current
      pages = [current];
    }
    
    pages.forEach(page => {
      if (page === '...') {
        const span = document.createElement('span');
        span.className = 'ez-nav-ellipsis';
        span.textContent = '...';
        pagesContainer.appendChild(span);
      } else {
        const btn = document.createElement('button');
        btn.className = 'ez-nav-page-btn';
        if (page === current) btn.classList.add('active');
        btn.textContent = page;
        btn.addEventListener('click', () => this.goToPage(page));
        pagesContainer.appendChild(btn);
      }
    });
  }
  
  // Update navigation bar
  updateNavigationBar() {
    this.currentPage = this.getCurrentPage();
    this.totalPages = this.estimateTotalPages();
    this.generatePageNumbers();
    
    // Update button states
    const firstBtn = document.getElementById('ez-nav-first');
    const prevBtn = document.getElementById('ez-nav-prev');
    const nextBtn = document.getElementById('ez-nav-next');
    const lastBtn = document.getElementById('ez-nav-last');
    
    if (firstBtn) firstBtn.disabled = this.currentPage === 1;
    if (prevBtn) prevBtn.disabled = this.currentPage === 1;
    if (nextBtn) nextBtn.disabled = false; // Gmail always allows next
    if (lastBtn) lastBtn.disabled = !this.totalPages;
  }
  
  // Setup event listeners
  setupEventListeners() {
    // Navigation buttons
    document.getElementById('ez-nav-first')?.addEventListener('click', () => this.firstPage());
    document.getElementById('ez-nav-prev')?.addEventListener('click', () => this.prevPage());
    document.getElementById('ez-nav-next')?.addEventListener('click', () => this.nextPage());
    document.getElementById('ez-nav-last')?.addEventListener('click', () => this.lastPage());
    
    // Quick jump
    const jumpBtn = document.getElementById('ez-nav-jump-btn');
    const jumpInput = document.getElementById('ez-nav-jump-input');
    
    if (jumpBtn && jumpInput) {
      jumpBtn.addEventListener('click', () => {
        const page = parseInt(jumpInput.value);
        if (page && page > 0) {
          this.goToPage(page);
          jumpInput.value = '';
        }
      });
      
      jumpInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          jumpBtn.click();
        }
      });
    }
    
    // Date jump button
    document.getElementById('ez-nav-date-btn')?.addEventListener('click', () => {
      this.showDatePicker();
    });
    
    // Listen for URL changes
    window.addEventListener('hashchange', () => {
      this.updateNavigationBar();
    });
  }
  
  // Show date picker modal
  showDatePicker() {
    const modal = document.createElement('div');
    modal.id = 'ez-date-picker-modal';
    modal.className = 'ez-modal';
    
    modal.innerHTML = `
      <div class="ez-modal-content">
        <div class="ez-modal-header">
          <h3>Jump to Date</h3>
          <button class="ez-modal-close">&times;</button>
        </div>
        <div class="ez-modal-body">
          ${this.settings.dateJump.showRelativeDates ? `
          <div class="ez-quick-dates">
            <button class="ez-date-btn" data-date="today">Today</button>
            <button class="ez-date-btn" data-date="yesterday">Yesterday</button>
            <button class="ez-date-btn" data-date="week">Last Week</button>
            <button class="ez-date-btn" data-date="month">Last Month</button>
            <button class="ez-date-btn" data-date="year">Last Year</button>
          </div>
          <div class="ez-divider">OR</div>
          ` : ''}
          <div class="ez-date-picker">
            <label>Select Date:</label>
            <input type="date" id="ez-date-input" />
            <select id="ez-date-mode">
              <option value="single">Emails on this date</option>
              <option value="after">Emails from this date onwards</option>
              <option value="before">Emails before this date</option>
            </select>
            <button class="ez-nav-btn-primary" id="ez-date-search-btn">Search</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.ez-modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    // Quick date buttons
    modal.querySelectorAll('.ez-date-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dateType = btn.dataset.date;
        const date = this.getRelativeDate(dateType);
        this.searchByDate(date);
        modal.remove();
      });
    });
    
    // Custom date search
    document.getElementById('ez-date-search-btn').addEventListener('click', () => {
      const dateInput = document.getElementById('ez-date-input');
      const modeSelect = document.getElementById('ez-date-mode');
      if (dateInput.value) {
        this.searchByDate(dateInput.value, modeSelect.value);
        modal.remove();
      }
    });
  }
  
  // Get relative date
  getRelativeDate(type) {
    const today = new Date();
    const date = new Date(today);
    
    switch (type) {
      case 'today':
        return date;
      case 'yesterday':
        date.setDate(date.getDate() - 1);
        return date;
      case 'week':
        date.setDate(date.getDate() - 7);
        return date;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        return date;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        return date;
      default:
        return date;
    }
  }
  
  // Initialize navigation
  init() {
    // Prevent multiple simultaneous initializations
    if (this.isInitializing) {
      console.log('Ez Gmail: Already initializing, skipping...');
      return;
    }
    
    // Check if already exists
    if (document.getElementById('ez-gmail-navigation')) {
      console.log('Ez Gmail: Navigation bar already exists');
      return;
    }
    
    this.isInitializing = true;
    
    // Find Gmail toolbar and insert navigation
    const toolbar = document.querySelector('[gh="mtb"]') || 
                   document.querySelector('.aeH') ||
                   document.querySelector('[role="banner"]');
    
    // Find Gmail main content area as fallback
    const mainContent = document.querySelector('.AO') || 
                       document.querySelector('[role="main"]') ||
                       document.querySelector('.nH.bkL');
    
    const insertTarget = toolbar || mainContent;
    
    if (insertTarget) {
      const nav = this.createNavigationBar();
      
      if (!nav) {
        console.error('Ez Gmail: Failed to create navigation bar');
        return;
      }
      
      // Insert after toolbar or at top of main content
      if (toolbar) {
        toolbar.parentNode.insertBefore(nav, toolbar.nextSibling);
      } else if (mainContent) {
        mainContent.insertBefore(nav, mainContent.firstChild);
      }
      
      // Force a reflow to ensure styles are applied
      nav.offsetHeight;
      
      // Wait for DOM and CSS to settle before setting up listeners
      // Use double requestAnimationFrame for better reliability
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.setupEventListeners();
          this.updateNavigationBar();
          
          // Verify layout is correct
          const container = nav.querySelector('.ez-nav-container');
          if (container) {
            const computedStyle = window.getComputedStyle(container);
            if (computedStyle.display !== 'flex') {
              console.warn('Ez Gmail: Layout may not be correct, display is', computedStyle.display);
            }
          }
        });
      });
      
      // Re-initialize on Gmail navigation changes
      this.observeGmailChanges();
      
      console.log('Ez Gmail: Navigation bar initialized successfully');
      this.isInitializing = false;
    } else {
      console.warn('Ez Gmail: Could not find insertion target');
      this.isInitializing = false;
    }
  }
  
  // Observe Gmail DOM changes to reinitialize if needed
  observeGmailChanges() {
    // Disconnect existing observer to prevent duplicates
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    // Clear any pending reinit timeout
    if (this.reinitTimeout) {
      clearTimeout(this.reinitTimeout);
      this.reinitTimeout = null;
    }
    
    // Create new observer
    this.observer = new MutationObserver(() => {
      if (!document.getElementById('ez-gmail-navigation')) {
        // Clear any pending reinit
        if (this.reinitTimeout) clearTimeout(this.reinitTimeout);
        
        // Schedule reinit after a short delay
        this.reinitTimeout = setTimeout(() => {
          console.log('Ez Gmail: Navigation bar removed, reinitializing...');
          this.init();
          this.reinitTimeout = null;
        }, 500);
      }
    });
    
    // Observe only the main Gmail container, not body (too broad)
    const target = document.querySelector('.nH.bkL') || document.querySelector('.AO');
    
    if (target) {
      this.observer.observe(target, { 
        childList: true, 
        subtree: false, // Changed to false to reduce observation scope
        attributes: false
      });
      console.log('Ez Gmail: DOM observer active on', target.className);
    } else {
      console.warn('Ez Gmail: Could not find Gmail container for observation');
    }
  }
}

// Export for use in content script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GmailNavigation;
}
