// Ez Gmail - Compose Window Integration
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Inject template button into Gmail compose windows

class ComposeIntegration {
  constructor(templateUI) {
    this.templateUI = templateUI;
    this.observedComposeWindows = new Set();
    this.observer = null;
  }

  // Initialize compose integration
  init() {
    console.log('Ez Gmail: Initializing compose integration...');
    
    // Wait for Gmail to load
    this.waitForGmail().then(() => {
      // Check for existing compose windows
      this.checkForComposeWindows();
      
      // Watch for new compose windows
      this.observeComposeWindows();
      
      console.log('Ez Gmail: Compose integration initialized');
    });
  }

  // Wait for Gmail to be ready
  async waitForGmail() {
    return new Promise((resolve) => {
      const checkGmail = () => {
        // Check if Gmail's main container exists
        const gmailContainer = document.querySelector('[role="main"]') || 
                              document.querySelector('.AO');
        
        if (gmailContainer) {
          resolve();
        } else {
          setTimeout(checkGmail, 100);
        }
      };
      
      checkGmail();
    });
  }

  // Check for existing compose windows
  checkForComposeWindows() {
    // Gmail compose window selectors
    const composeSelectors = [
      '.AD',  // Main compose window class
      '[role="dialog"]',  // Dialog role
      '.dw'  // Alternative compose class
    ];
    
    composeSelectors.forEach(selector => {
      const composeWindows = document.querySelectorAll(selector);
      composeWindows.forEach(window => {
        // Check if it's actually a compose window
        if (this.isComposeWindow(window)) {
          this.injectTemplateButton(window);
        }
      });
    });
  }

  // Check if element is a compose window
  isComposeWindow(element) {
    // Look for compose-specific elements
    const hasSubjectField = element.querySelector('[name="subjectbox"]') ||
                           element.querySelector('input[aria-label*="Subject"]');
    
    const hasBodyField = element.querySelector('[role="textbox"]') ||
                        element.querySelector('[aria-label*="Message Body"]');
    
    return !!(hasSubjectField || hasBodyField);
  }

  // Observe for new compose windows
  observeComposeWindows() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check if the node itself is a compose window
            if (this.isComposeWindow(node)) {
              this.injectTemplateButton(node);
            }
            
            // Check children for compose windows
            const composeWindows = node.querySelectorAll ? 
              node.querySelectorAll('.AD, [role="dialog"]') : [];
            
            composeWindows.forEach(window => {
              if (this.isComposeWindow(window)) {
                this.injectTemplateButton(window);
              }
            });
          }
        });
      });
    });
    
    // Observe the entire document
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Inject template button into compose window
  injectTemplateButton(composeWindow) {
    // Check if we've already injected into this window
    const windowId = this.getComposeWindowId(composeWindow);
    if (this.observedComposeWindows.has(windowId)) {
      return;
    }
    
    // Check if button already exists in this compose window
    if (composeWindow.querySelector('.ez-template-insert-btn')) {
      this.observedComposeWindows.add(windowId);
      return;
    }
    
    // Find the toolbar area
    const toolbar = this.findComposeToolbar(composeWindow);
    if (!toolbar) {
      console.log('Ez Gmail: Could not find compose toolbar');
      return;
    }
    
    // Check if toolbar already has our button
    if (toolbar.querySelector('.ez-template-insert-btn')) {
      this.observedComposeWindows.add(windowId);
      return;
    }
    
    // Create template button
    const button = this.createTemplateButton(composeWindow);
    
    // Insert button at the beginning of toolbar
    toolbar.insertBefore(button, toolbar.firstChild);
    
    // Mark this window as processed
    this.observedComposeWindows.add(windowId);
    
    console.log('Ez Gmail: Template button injected into compose window');
  }

  // Get unique ID for compose window
  getComposeWindowId(composeWindow) {
    // Try to get existing ID
    let id = composeWindow.dataset.ezComposeId;
    
    // If no ID, create one
    if (!id) {
      id = 'compose_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      composeWindow.dataset.ezComposeId = id;
    }
    
    return id;
  }

  // Find compose toolbar
  findComposeToolbar(composeWindow) {
    // Try multiple selectors for the toolbar
    const toolbarSelectors = [
      '.btC',  // Main toolbar class
      '[role="toolbar"]',  // Toolbar role
      '.gU.Up',  // Alternative toolbar
      '.aDh'  // Another toolbar class
    ];
    
    for (const selector of toolbarSelectors) {
      const toolbar = composeWindow.querySelector(selector);
      if (toolbar) {
        return toolbar;
      }
    }
    
    // Fallback: find any element with toolbar-like children
    const toolbarLike = composeWindow.querySelector('[data-tooltip], .T-I');
    if (toolbarLike && toolbarLike.parentElement) {
      return toolbarLike.parentElement;
    }
    
    return null;
  }

  // Create template button
  createTemplateButton(composeWindow) {
    const button = document.createElement('button');
    button.className = 'ez-template-insert-btn';
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'Insert Email Template');
    button.setAttribute('aria-label', 'Insert Email Template');
    
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-3-7v2H9v-2h6zm0 4v2H9v-2h6z"/>
      </svg>
      <span>Templates</span>
    `;
    
    // Add click handler
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleTemplateButtonClick(composeWindow);
    });
    
    return button;
  }

  // Handle template button click
  handleTemplateButtonClick(composeWindow) {
    console.log('Ez Gmail: Template button clicked');
    
    // Show template picker
    this.templateUI.showTemplatePicker((template) => {
      this.insertTemplateIntoCompose(composeWindow, template);
    });
  }

  // Insert template into compose window
  insertTemplateIntoCompose(composeWindow, template) {
    console.log('Ez Gmail: Inserting template into compose:', template.name);
    
    // Find subject field
    const subjectField = this.findSubjectField(composeWindow);
    if (subjectField && template.subject) {
      this.setFieldValue(subjectField, template.subject);
    }
    
    // Find body field
    const bodyField = this.findBodyField(composeWindow);
    if (bodyField && template.body) {
      this.setFieldValue(bodyField, template.body);
    }
    
    // Show success notification
    this.templateUI.showNotification(`Template "${template.name}" inserted!`, 'success');
  }

  // Find subject field
  findSubjectField(composeWindow) {
    const selectors = [
      '[name="subjectbox"]',
      'input[aria-label*="Subject"]',
      '.aoT'
    ];
    
    for (const selector of selectors) {
      const field = composeWindow.querySelector(selector);
      if (field) return field;
    }
    
    return null;
  }

  // Find body field
  findBodyField(composeWindow) {
    const selectors = [
      '[role="textbox"][aria-label*="Message"]',
      '[contenteditable="true"][role="textbox"]',
      '.Am.Al.editable',
      'div[aria-label*="Message Body"]'
    ];
    
    for (const selector of selectors) {
      const field = composeWindow.querySelector(selector);
      if (field) return field;
    }
    
    return null;
  }

  // Set field value (works for both input and contenteditable)
  setFieldValue(field, value) {
    if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
      // Standard input field
      field.value = value;
      
      // Trigger input event
      const event = new Event('input', { bubbles: true });
      field.dispatchEvent(event);
    } else if (field.contentEditable === 'true') {
      // ContentEditable div (Gmail's body field)
      
      // Check if value contains HTML (starts with < and contains tags)
      const isHTML = value.trim().startsWith('<') && /<[^>]+>/.test(value);
      
      if (isHTML) {
        // Insert HTML directly for signatures and formatted content
        // Add two blank lines before HTML content
        field.innerHTML = '<br><br>' + value;
      } else {
        // Convert newlines to <br> tags for plain text
        // Add two blank lines before plain text content
        const htmlValue = value.replace(/\n/g, '<br>');
        field.innerHTML = '<br><br>' + htmlValue;
      }
      
      // Trigger input event
      const event = new Event('input', { bubbles: true });
      field.dispatchEvent(event);
      
      // Also trigger Gmail's custom events
      field.dispatchEvent(new Event('textInput', { bubbles: true }));
      field.dispatchEvent(new Event('keyup', { bubbles: true }));
    }
    
    // Focus the field
    field.focus();
  }

  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    this.observedComposeWindows.clear();
  }
}

// Note: Initialization is now handled by content.js
console.log('Ez Gmail: Compose integration script loaded');

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComposeIntegration;
}
