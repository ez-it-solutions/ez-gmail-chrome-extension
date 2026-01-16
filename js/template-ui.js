// Ez Gmail - Template UI Components
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// UI components for template picker and variable input

class TemplateUI {
  constructor(templateManager) {
    this.templateManager = templateManager;
    this.currentModal = null;
    this.currentTemplate = null;
    this.onInsertCallback = null;
    this.searchQuery = '';
    this.selectedCategory = 'all';
  }

  // Show template picker modal
  async showTemplatePicker(onInsert) {
    this.onInsertCallback = onInsert;
    
    // Load templates
    await this.templateManager.init();
    const templates = this.templateManager.getAllTemplates();
    
    // Create modal
    const modal = this.createTemplatePickerModal(templates);
    document.body.appendChild(modal);
    this.currentModal = modal;
    
    // Setup event listeners
    this.setupTemplatePickerEvents(modal);
    
    console.log('Ez Gmail: Template picker opened');
  }

  // Create template picker modal HTML
  createTemplatePickerModal(templates) {
    const modal = document.createElement('div');
    modal.className = 'ez-template-modal';
    modal.id = 'ez-template-picker-modal';
    
    modal.innerHTML = `
      <div class="ez-template-modal-content">
        <div class="ez-template-modal-header">
          <h2>Insert Email Template</h2>
          <div class="ez-template-header-actions">
            <button class="ez-template-create-btn" title="Create New Template">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Template
            </button>
            <button class="ez-template-modal-close" aria-label="Close">&times;</button>
          </div>
        </div>
        
        <div class="ez-template-search-bar">
          <input 
            type="text" 
            class="ez-template-search-input" 
            placeholder="Search templates..."
            id="ez-template-search"
          />
          <select class="ez-template-category-filter" id="ez-template-category">
            <option value="all">All Categories</option>
            ${this.templateManager.getCategories().map(cat => 
              `<option value="${cat}">${cat}</option>`
            ).join('')}
          </select>
        </div>
        
        <div class="ez-template-list" id="ez-template-list">
          ${this.renderTemplateList(templates)}
        </div>
      </div>
    `;
    
    return modal;
  }

  // Render template list
  renderTemplateList(templates) {
    if (templates.length === 0) {
      return `
        <div class="ez-template-empty">
          <div class="ez-template-empty-icon">📝</div>
          <div class="ez-template-empty-text">No templates found</div>
          <div class="ez-template-empty-subtext">
            ${this.searchQuery || this.selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Create your first template to get started'}
          </div>
        </div>
      `;
    }
    
    return templates.map(template => `
      <div class="ez-template-item" data-template-id="${template.id}">
        <div class="ez-template-item-header">
          <span class="ez-template-item-name">${this.escapeHtml(template.name)}</span>
          <span class="ez-template-item-category">${template.category}</span>
        </div>
        ${template.subject ? `
          <div class="ez-template-item-subject">
            Subject: ${this.escapeHtml(template.subject)}
          </div>
        ` : ''}
        <div class="ez-template-item-body">
          ${this.escapeHtml(template.body)}
        </div>
        <div class="ez-template-item-meta">
          ${template.variables.length > 0 ? `
            <span title="Variables">
              🏷️ ${template.variables.length} variable${template.variables.length > 1 ? 's' : ''}
            </span>
          ` : ''}
          <span title="Usage count">
            📊 Used ${template.usageCount} time${template.usageCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    `).join('');
  }

  // Setup template picker event listeners
  setupTemplatePickerEvents(modal) {
    // Create Template button
    const createBtn = modal.querySelector('.ez-template-create-btn');
    createBtn.addEventListener('click', () => this.showCreateTemplateModal());
    
    // Close button
    const closeBtn = modal.querySelector('.ez-template-modal-close');
    closeBtn.addEventListener('click', () => this.closeModal());
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });
    
    // Escape key to close
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Search input
    const searchInput = modal.querySelector('#ez-template-search');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.filterAndRenderTemplates();
    });
    
    // Category filter
    const categorySelect = modal.querySelector('#ez-template-category');
    categorySelect.addEventListener('change', (e) => {
      this.selectedCategory = e.target.value;
      this.filterAndRenderTemplates();
    });
    
    // Template item clicks
    const templateList = modal.querySelector('#ez-template-list');
    templateList.addEventListener('click', (e) => {
      const templateItem = e.target.closest('.ez-template-item');
      if (templateItem) {
        const templateId = templateItem.dataset.templateId;
        this.selectTemplate(templateId);
      }
    });
  }

  // Filter and re-render templates
  filterAndRenderTemplates() {
    let templates = this.templateManager.getAllTemplates();
    
    // Apply search filter
    if (this.searchQuery) {
      templates = this.templateManager.searchTemplates(this.searchQuery);
    }
    
    // Apply category filter
    if (this.selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === this.selectedCategory);
    }
    
    // Re-render list
    const templateList = document.querySelector('#ez-template-list');
    if (templateList) {
      templateList.innerHTML = this.renderTemplateList(templates);
    }
  }

  // Select template
  async selectTemplate(templateId) {
    const template = this.templateManager.getTemplate(templateId);
    if (!template) return;
    
    this.currentTemplate = template;
    
    // If template has variables, show variable input modal
    if (template.variables.length > 0) {
      this.showVariableModal(template);
    } else {
      // No variables, insert directly
      await this.insertTemplate(template, {});
    }
  }

  // Show create template modal
  showCreateTemplateModal() {
    const modal = document.createElement('div');
    modal.className = 'ez-variable-modal';
    modal.id = 'ez-create-template-modal';
    
    modal.innerHTML = `
      <div class="ez-variable-modal-content" style="max-width: 600px;">
        <div class="ez-variable-modal-header">
          <h3>Create New Template</h3>
        </div>
        
        <div class="ez-variable-modal-body">
          <div class="ez-variable-input-group">
            <label class="ez-variable-label" for="template-name">
              Template Name *
            </label>
            <input 
              type="text" 
              class="ez-variable-input" 
              id="template-name"
              placeholder="e.g., Meeting Follow-up"
              required
            />
          </div>
          
          <div class="ez-variable-input-group">
            <label class="ez-variable-label" for="template-category">
              Category
            </label>
            <select class="ez-variable-input" id="template-category" style="height: 40px; cursor: pointer;">
              ${this.templateManager.getCategories().map(cat => 
                `<option value="${cat}">${cat}</option>`
              ).join('')}
            </select>
          </div>
          
          <div class="ez-variable-input-group">
            <label class="ez-variable-label" for="template-subject">
              Subject
            </label>
            <input 
              type="text" 
              class="ez-variable-input" 
              id="template-subject"
              placeholder="e.g., Re: Meeting with {{name}}"
            />
            <small style="color: #80868b; font-size: 12px; margin-top: 4px; display: block;">
              Use {{variableName}} for dynamic content
            </small>
          </div>
          
          <div class="ez-variable-input-group">
            <label class="ez-variable-label" for="template-body">
              Body *
            </label>
            <textarea 
              class="ez-variable-input" 
              id="template-body"
              placeholder="Hi {{name}},&#10;&#10;Thank you for..."
              rows="8"
              style="resize: vertical; font-family: inherit; padding: 12px;"
              required
            ></textarea>
            <small style="color: #80868b; font-size: 12px; margin-top: 4px; display: block;">
              Use {{variableName}} for dynamic content
            </small>
          </div>
        </div>
        
        <div class="ez-variable-modal-footer">
          <button class="ez-variable-btn ez-variable-btn-cancel">Cancel</button>
          <button class="ez-variable-btn ez-variable-btn-insert">Create Template</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup event listeners
    const cancelBtn = modal.querySelector('.ez-variable-btn-cancel');
    cancelBtn.addEventListener('click', () => modal.remove());
    
    const createBtn = modal.querySelector('.ez-variable-btn-insert');
    createBtn.addEventListener('click', async () => {
      const name = modal.querySelector('#template-name').value.trim();
      const category = modal.querySelector('#template-category').value;
      const subject = modal.querySelector('#template-subject').value.trim();
      const body = modal.querySelector('#template-body').value.trim();
      
      if (!name || !body) {
        this.showNotification('Please fill in required fields (Name and Body)', 'error');
        return;
      }
      
      // Create template
      const template = await this.templateManager.createTemplate({
        name,
        category,
        subject,
        body
      });
      
      if (template) {
        this.showNotification(`Template "${name}" created successfully!`, 'success');
        modal.remove();
        
        // Refresh template list
        this.filterAndRenderTemplates();
      } else {
        this.showNotification('Failed to create template', 'error');
      }
    });
    
    // Focus first input
    setTimeout(() => modal.querySelector('#template-name').focus(), 100);
  }

  // Show variable input modal
  showVariableModal(template) {
    const modal = this.createVariableModal(template);
    document.body.appendChild(modal);
    
    // Setup event listeners
    this.setupVariableModalEvents(modal, template);
    
    console.log('Ez Gmail: Variable modal opened for template:', template.name);
  }

  // Create variable input modal
  createVariableModal(template) {
    const modal = document.createElement('div');
    modal.className = 'ez-variable-modal';
    modal.id = 'ez-variable-modal';
    
    modal.innerHTML = `
      <div class="ez-variable-modal-content">
        <div class="ez-variable-modal-header">
          <h3>Fill in Template Variables</h3>
        </div>
        
        <div class="ez-variable-modal-body">
          ${template.variables.map(variable => `
            <div class="ez-variable-input-group">
              <label class="ez-variable-label" for="var-${variable}">
                ${this.formatVariableName(variable)}
              </label>
              <input 
                type="text" 
                class="ez-variable-input" 
                id="var-${variable}"
                data-variable="${variable}"
                placeholder="Enter ${variable}..."
              />
            </div>
          `).join('')}
        </div>
        
        <div class="ez-variable-modal-footer">
          <button class="ez-variable-btn ez-variable-btn-cancel">Cancel</button>
          <button class="ez-variable-btn ez-variable-btn-insert">Insert Template</button>
        </div>
      </div>
    `;
    
    return modal;
  }

  // Setup variable modal event listeners
  setupVariableModalEvents(modal, template) {
    // Cancel button
    const cancelBtn = modal.querySelector('.ez-variable-btn-cancel');
    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    // Insert button
    const insertBtn = modal.querySelector('.ez-variable-btn-insert');
    insertBtn.addEventListener('click', async () => {
      const values = this.getVariableValues(modal);
      await this.insertTemplate(template, values);
      modal.remove();
    });
    
    // Enter key to insert
    modal.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const values = this.getVariableValues(modal);
        await this.insertTemplate(template, values);
        modal.remove();
      }
    });
    
    // Focus first input
    const firstInput = modal.querySelector('.ez-variable-input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  // Get variable values from modal
  getVariableValues(modal) {
    const values = {};
    const inputs = modal.querySelectorAll('.ez-variable-input');
    
    inputs.forEach(input => {
      const variable = input.dataset.variable;
      values[variable] = input.value;
    });
    
    return values;
  }

  // Insert template with values
  async insertTemplate(template, values) {
    // Get template with variables replaced
    const processedTemplate = this.templateManager.getTemplateWithValues(template.id, values);
    
    // Increment usage count
    await this.templateManager.incrementUsage(template.id);
    
    // Call the insert callback
    if (this.onInsertCallback) {
      this.onInsertCallback(processedTemplate);
    }
    
    // Close modals
    this.closeModal();
    
    console.log('Ez Gmail: Template inserted:', template.name);
  }

  // Close modal
  closeModal() {
    if (this.currentModal) {
      this.currentModal.remove();
      this.currentModal = null;
    }
    
    // Also close variable modal if open
    const variableModal = document.getElementById('ez-variable-modal');
    if (variableModal) {
      variableModal.remove();
    }
    
    // Reset state
    this.currentTemplate = null;
    this.searchQuery = '';
    this.selectedCategory = 'all';
  }

  // Format variable name for display
  formatVariableName(variable) {
    // Convert camelCase or snake_case to Title Case
    return variable
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Show notification
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `ez-notification ez-notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background: ${type === 'success' ? '#34a853' : '#ea4335'};
      color: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 10003;
      animation: ezSlideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'ezFadeOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Create global instance
window.ezGmailTemplateUI = null;

// Initialize when template manager is ready
if (window.ezGmailTemplateManager) {
  window.ezGmailTemplateUI = new TemplateUI(window.ezGmailTemplateManager);
  console.log('Ez Gmail: Template UI initialized');
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TemplateUI;
}
