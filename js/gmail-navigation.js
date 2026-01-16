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
    this.styleObserver = null; // Observer for style changes
    this.reinitTimeout = null; // Store timeout reference for cleanup
    this.listenersAttached = false; // Track if listeners are already attached
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
    
    // Add data attributes to mark this as extension content
    nav.setAttribute('data-ez-gmail', 'true');
    nav.setAttribute('data-extension-element', 'true');
    
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
    // Only attach listeners once to prevent duplicates
    if (this.listenersAttached) {
      console.log('Ez Gmail: Listeners already attached, skipping...');
      return;
    }
    
    // Navigation buttons
    document.getElementById('ez-nav-first')?.addEventListener('click', () => this.firstPage());
    document.getElementById('ez-nav-prev')?.addEventListener('click', () => this.prevPage());
    document.getElementById('ez-nav-next')?.addEventListener('click', () => this.nextPage());
    document.getElementById('ez-nav-last')?.addEventListener('click', () => this.lastPage());
    
    // Quick jump - always goes to inbox page
    const jumpBtn = document.getElementById('ez-nav-jump-btn');
    const jumpInput = document.getElementById('ez-nav-jump-input');
    
    if (jumpBtn && jumpInput) {
      jumpBtn.addEventListener('click', () => {
        const page = parseInt(jumpInput.value);
        if (page && page > 0) {
          // Jump to inbox page, not search results
          const baseUrl = window.location.origin + window.location.pathname;
          window.location.href = `${baseUrl}#inbox/p${page}`;
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
    
    // Mark listeners as attached
    this.listenersAttached = true;
    console.log('Ez Gmail: Event listeners attached successfully');
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
  
  // Enforce critical styles inline to override Gmail's CSS
  enforceStyles(nav) {
    if (!nav) return;
    
    // Check if animation has completed
    const isLoaded = nav.classList.contains('ez-nav-loaded');
    
    // Force critical styles inline with highest priority
    nav.style.setProperty('display', 'block', 'important');
    nav.style.setProperty('visibility', 'visible', 'important');
    nav.style.setProperty('position', 'relative', 'important');
    
    // Don't override opacity/transform during animation
    if (isLoaded) {
      nav.style.setProperty('opacity', '1', 'important');
    }
    
    const container = nav.querySelector('.ez-nav-container');
    if (container) {
      container.style.setProperty('display', 'flex', 'important');
      container.style.setProperty('flex-direction', 'row', 'important');
      container.style.setProperty('align-items', 'center', 'important');
      container.style.setProperty('justify-content', 'space-between', 'important');
      container.style.setProperty('flex-wrap', 'nowrap', 'important');
    }
    
    const navLeft = nav.querySelector('.ez-nav-left');
    if (navLeft) {
      navLeft.style.setProperty('display', 'flex', 'important');
      navLeft.style.setProperty('flex-direction', 'row', 'important');
      navLeft.style.setProperty('align-items', 'center', 'important');
      navLeft.style.setProperty('flex', '1', 'important');
    }
    
    const navRight = nav.querySelector('.ez-nav-right');
    if (navRight) {
      navRight.style.setProperty('display', 'flex', 'important');
      navRight.style.setProperty('flex-direction', 'row', 'important');
      navRight.style.setProperty('align-items', 'center', 'important');
    }
    
    const navSections = nav.querySelectorAll('.ez-nav-section');
    navSections.forEach(section => {
      section.style.setProperty('display', 'flex', 'important');
      section.style.setProperty('flex-direction', 'row', 'important');
      section.style.setProperty('align-items', 'center', 'important');
    });
  }
  
  // Watch for style changes and immediately re-apply
  watchStyleChanges(nav) {
    if (!nav) return;
    
    // Disconnect existing style observer
    if (this.styleObserver) {
      this.styleObserver.disconnect();
      this.styleObserver = null;
    }
    
    let isEnforcing = false; // Prevent infinite loop
    
    // Create observer to watch for style/class changes
    this.styleObserver = new MutationObserver((mutations) => {
      // Skip if we're currently enforcing styles
      if (isEnforcing) return;
      
      let needsReapply = false;
      
      mutations.forEach(mutation => {
        // Only react to external changes (not our own)
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          const target = mutation.target;
          // Check if this looks like Gmail interference
          if (target.id === 'ez-gmail-navigation' || target.closest('#ez-gmail-navigation')) {
            needsReapply = true;
          }
        }
      });
      
      if (needsReapply) {
        // Temporarily disconnect to prevent infinite loop
        this.styleObserver.disconnect();
        isEnforcing = true;
        
        // Re-apply styles
        this.enforceStyles(nav);
        
        // Reconnect after a brief delay
        setTimeout(() => {
          isEnforcing = false;
          if (this.styleObserver && nav.isConnected) {
            this.styleObserver.observe(nav, {
              attributes: true,
              attributeFilter: ['style', 'class'],
              subtree: true
            });
          }
        }, 50);
      }
    });
    
    // Observe the nav and all its children
    this.styleObserver.observe(nav, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: true
    });
    
    console.log('Ez Gmail: Style protection active');
  }
  
  // Wait for just the basic Gmail structure to exist
  waitForBasicStructure() {
    return new Promise((resolve) => {
      const checkStructure = () => {
        // Just wait for the basic container where we'll insert
        const container = document.querySelector('.AO') || 
                         document.querySelector('[role="main"]') ||
                         document.body;
        
        if (container && container !== document.body) {
          console.log('Ez Gmail: Basic structure found');
          resolve();
        } else if (document.body) {
          // If body exists but Gmail containers don't, wait a bit
          setTimeout(checkStructure, 100);
        } else {
          // Body doesn't exist yet, wait
          setTimeout(checkStructure, 50);
        }
      };
      
      checkStructure();
    });
  }
  
  // Initialize navigation
  async init() {
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
    
    // Wait for just the basic structure
    console.log('Ez Gmail: Waiting for basic Gmail structure...');
    await this.waitForBasicStructure();
    
    // Find the Gmail toolbar (the bar with select all, refresh, etc.)
    const toolbar = document.querySelector('[gh="mtb"]') || 
                   document.querySelector('.aeH') ||
                   document.querySelector('[role="toolbar"]');
    
    // Find the email list container (where emails are displayed)
    const emailListContainer = document.querySelector('.AO') ||
                              document.querySelector('[role="main"]');
    
    // Create navigation immediately
    const nav = this.createNavigationBar();
    
    if (!nav) {
      console.error('Ez Gmail: Failed to create navigation bar');
      this.isInitializing = false;
      return;
    }
    
    // Insert into container immediately - don't wait for toolbar
    if (emailListContainer) {
      emailListContainer.insertBefore(nav, emailListContainer.firstChild);
      console.log('Ez Gmail: Navigation inserted early into email container');
    } else {
      document.body.appendChild(nav);
      console.log('Ez Gmail: Navigation inserted into body (will relocate)');
    }
    
    // Immediately apply styles before Gmail can interfere
    this.enforceStyles(nav);
    
    // Start watching for style changes immediately
    this.watchStyleChanges(nav);
    
    // Trigger slide-down animation after a brief moment
    setTimeout(() => {
      nav.classList.add('ez-nav-loaded');
      console.log('Ez Gmail: Slide-down animation triggered');
    }, 50);
    
    // If toolbar doesn't exist yet, watch for it and relocate
    if (!toolbar) {
      const relocateWatcher = setInterval(() => {
        const newToolbar = document.querySelector('[gh="mtb"]');
        if (newToolbar && newToolbar.parentNode) {
          clearInterval(relocateWatcher);
          const currentNav = document.getElementById('ez-gmail-navigation');
          if (currentNav && newToolbar.nextSibling !== currentNav) {
            console.log('Ez Gmail: Relocating navigation to correct position');
            newToolbar.parentNode.insertBefore(currentNav, newToolbar.nextSibling);
            this.enforceStyles(currentNav);
          }
        }
      }, 100);
      
      // Stop watching after 5 seconds
      setTimeout(() => clearInterval(relocateWatcher), 5000);
    }
    
    // Setup immediately
    requestAnimationFrame(() => {
      // Force a reflow
      nav.offsetHeight;
      
      // Re-enforce styles
      this.enforceStyles(nav);
      
      this.setupEventListeners();
      this.updateNavigationBar();
      
      // Verify layout is correct
      const container = nav.querySelector('.ez-nav-container');
      if (container) {
        const computedStyle = window.getComputedStyle(container);
        console.log('Ez Gmail: Container computed styles:', {
          display: computedStyle.display,
          flexDirection: computedStyle.flexDirection,
          alignItems: computedStyle.alignItems,
          position: computedStyle.position
        });
        
        // Check for pseudo-elements
        const beforeStyle = window.getComputedStyle(container, '::before');
        const afterStyle = window.getComputedStyle(container, '::after');
        console.log('Ez Gmail: Pseudo-element check:', {
          beforeContent: beforeStyle.content,
          beforeDisplay: beforeStyle.display,
          afterContent: afterStyle.content,
          afterDisplay: afterStyle.display
        });
        
        if (computedStyle.display !== 'flex') {
          console.warn('Ez Gmail: Layout may not be correct, display is', computedStyle.display);
          // Force fix if layout is wrong
          this.enforceStyles(nav);
        }
      }
      
      // Continuous enforcement to combat Gmail's dynamic changes
      const enforcementIntervals = [100, 250, 500, 1000, 2000];
      enforcementIntervals.forEach(delay => {
        setTimeout(() => {
          if (document.getElementById('ez-gmail-navigation')) {
            this.enforceStyles(nav);
          }
        }, delay);
      });
    });
    
    // Re-initialize on Gmail navigation changes
    this.observeGmailChanges();
    
    console.log('Ez Gmail: Navigation bar initialized successfully');
    this.isInitializing = false;
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
    
    // Create new observer with throttling
    let lastCheck = 0;
    const CHECK_INTERVAL = 2000; // Only check every 2 seconds
    
    this.observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastCheck < CHECK_INTERVAL) {
        return; // Throttle checks
      }
      lastCheck = now;
      
      if (!document.getElementById('ez-gmail-navigation')) {
        // Clear any pending reinit
        if (this.reinitTimeout) clearTimeout(this.reinitTimeout);
        
        // Schedule reinit with longer delay to let Gmail finish loading
        this.reinitTimeout = setTimeout(() => {
          console.log('Ez Gmail: Navigation bar removed, reinitializing...');
          // Reset initialization flag in case it got stuck
          this.isInitializing = false;
          this.listenersAttached = false; // Reset listeners flag too
          this.init();
          this.reinitTimeout = null;
        }, 1500); // Increased from 1000ms to 1500ms
      }
    });
    
    // Observe the email list container where our nav is inserted
    const emailListContainer = document.querySelector('.AO') || 
                              document.querySelector('[role="main"]');
    const toolbar = document.querySelector('[gh="mtb"]');
    
    // Watch the parent of the toolbar if it exists, otherwise the email list
    const target = (toolbar && toolbar.parentNode) || emailListContainer;
    
    if (target) {
      this.observer.observe(target, { 
        childList: true, 
        subtree: false, // Only watch direct children
        attributes: false
      });
      console.log('Ez Gmail: DOM observer active on', target.className || target.tagName);
    } else {
      console.warn('Ez Gmail: Could not find Gmail container for observation');
    }
  }
}

// Export for use in content script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GmailNavigation;
}
