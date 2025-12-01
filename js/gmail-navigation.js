// Ez Gmail - Gmail Navigation System
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Advanced page and date navigation for Gmail

class GmailNavigation {
  constructor(settings) {
    this.settings = settings;
    this.currentPage = this.getCurrentPage();
    this.totalPages = null;
    this.navigationBar = null;
  }
  
  // Get current page from URL
  getCurrentPage() {
    const match = window.location.hash.match(/#inbox\/p(\d+)/);
    return match ? parseInt(match[1]) : 1;
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
    
    const currentView = window.location.hash.split('/')[0];
    window.location.hash = `${currentView}/p${pageNumber}`;
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
      // We need to search: after:(day-1) before:(day+1)
      const targetDate = new Date(date);
      const beforeDate = new Date(targetDate);
      beforeDate.setDate(beforeDate.getDate() + 1);
      
      const targetStr = this.formatDateForSearch(targetDate);
      const beforeStr = this.formatDateForSearch(beforeDate);
      
      searchQuery = `after:${targetStr} before:${beforeStr}`;
    } else if (mode === 'after') {
      // From date onwards
      const dateStr = this.formatDateForSearch(new Date(date));
      searchQuery = `after:${dateStr}`;
    } else if (mode === 'before') {
      // Before date
      const dateStr = this.formatDateForSearch(new Date(date));
      searchQuery = `before:${dateStr}`;
    }
    
    // Use Gmail's advanced search URL format
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedQuery = encodeURIComponent(searchQuery);
    const advancedSearchUrl = `${baseUrl}?q=${encodedQuery}#search/${encodedQuery}`;
    
    // Navigate to search results
    window.location.href = advancedSearchUrl;
  }
  
  // Format date for Gmail search (YYYY/MM/DD)
  formatDateForSearch(date) {
    const d = new Date(date);
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
    
    nav.innerHTML = `
      <div class="ez-nav-container">
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
        
        <div class="ez-nav-section ez-nav-pages" id="ez-nav-pages">
          <!-- Page numbers will be inserted here -->
        </div>
        
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
        
        ${this.settings.navigation.showQuickJump ? `
        <div class="ez-nav-section ez-nav-jump">
          <span class="ez-nav-label">Go to:</span>
          <input type="number" id="ez-nav-jump-input" min="1" placeholder="Page #" />
          <button class="ez-nav-btn-primary" id="ez-nav-jump-btn">Jump</button>
        </div>
        ` : ''}
        
        ${this.settings.navigation.showDateJump ? `
        <div class="ez-nav-section ez-nav-date">
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
        ` : ''}
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
    // Find Gmail toolbar and insert navigation
    const toolbar = document.querySelector('[gh="mtb"]') || 
                   document.querySelector('.aeH') ||
                   document.querySelector('[role="banner"]');
    
    // Find Gmail main content area as fallback
    const mainContent = document.querySelector('.AO') || 
                       document.querySelector('[role="main"]') ||
                       document.querySelector('.nH.bkL');
    
    const insertTarget = toolbar || mainContent;
    
    if (insertTarget && !document.getElementById('ez-gmail-navigation')) {
      const nav = this.createNavigationBar();
      
      // Insert after toolbar or at top of main content
      if (toolbar) {
        toolbar.parentNode.insertBefore(nav, toolbar.nextSibling);
      } else if (mainContent) {
        mainContent.insertBefore(nav, mainContent.firstChild);
      }
      
      this.setupEventListeners();
      this.updateNavigationBar();
      
      // Re-initialize on Gmail navigation changes
      this.observeGmailChanges();
    }
  }
  
  // Observe Gmail DOM changes to reinitialize if needed
  observeGmailChanges() {
    const observer = new MutationObserver(() => {
      if (!document.getElementById('ez-gmail-navigation')) {
        this.init();
      }
    });
    
    const target = document.querySelector('.nH.bkL') || document.body;
    observer.observe(target, { childList: true, subtree: false });
  }
}

// Export for use in content script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GmailNavigation;
}
