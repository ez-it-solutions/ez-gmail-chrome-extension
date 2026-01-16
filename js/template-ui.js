// Ez Gmail - Template UI Components
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// UI components for template picker and variable input

class TemplateUI {
  constructor(templateManager, profileManager) {
    this.templateManager = templateManager;
    this.profileManager = profileManager;
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
            <button class="ez-template-import-btn" title="Import Templates from JSON">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Import
            </button>
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
      // Check if user has NO templates at all (not just filtered out)
      const hasNoTemplates = this.templateManager.getAllTemplates().length === 0;
      const prebuiltCount = this.templateManager.getPrebuiltCount('all');
      
      // Check if filtering by category with no results
      const categoryKey = this.selectedCategory.toLowerCase();
      const categoryPrebuiltCount = this.templateManager.getPrebuiltCount(categoryKey);
      const isFilteredCategory = this.selectedCategory !== 'all' && categoryPrebuiltCount > 0;
      
      return `
        <div class="ez-template-empty">
          <div class="ez-template-empty-icon">📝</div>
          <div class="ez-template-empty-text">No templates found</div>
          <div class="ez-template-empty-subtext">
            ${this.searchQuery 
              ? 'Try adjusting your search' 
              : isFilteredCategory
                ? `No ${this.selectedCategory} templates yet`
                : 'Create your first template to get started'}
          </div>
          ${hasNoTemplates && prebuiltCount > 0 ? `
            <button class="ez-template-load-samples-btn" id="ez-load-samples" data-category="all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              Load ${prebuiltCount} Sample Templates
            </button>
          ` : isFilteredCategory ? `
            <button class="ez-template-load-samples-btn" id="ez-load-category" data-category="${categoryKey}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              Load ${categoryPrebuiltCount} ${this.selectedCategory} Template${categoryPrebuiltCount !== 1 ? 's' : ''}
            </button>
          ` : ''}
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
    // Import Templates button
    const importBtn = modal.querySelector('.ez-template-import-btn');
    importBtn.addEventListener('click', () => this.showImportModal());
    
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
      
      // Load all samples button
      const loadSamplesBtn = e.target.closest('#ez-load-samples');
      if (loadSamplesBtn) {
        const category = loadSamplesBtn.dataset.category || 'all';
        this.loadSampleTemplates(category);
      }
      
      // Load category samples button
      const loadCategoryBtn = e.target.closest('#ez-load-category');
      if (loadCategoryBtn) {
        const category = loadCategoryBtn.dataset.category;
        this.loadSampleTemplates(category);
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

  // Show import templates modal
  showImportModal() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const imported = JSON.parse(text);
        
        // Validate format
        if (!Array.isArray(imported)) {
          this.showNotification('Invalid file format. Expected JSON array of templates.', 'error');
          return;
        }
        
        // Import templates
        const success = await this.templateManager.importTemplates(text, true);
        
        if (success) {
          this.showNotification(`Successfully imported ${imported.length} template(s)!`, 'success');
          this.filterAndRenderTemplates();
        } else {
          this.showNotification('Failed to import templates', 'error');
        }
      } catch (error) {
        console.error('Ez Gmail: Error importing templates:', error);
        this.showNotification('Error reading file. Please check the file format.', 'error');
      }
      
      // Clean up
      fileInput.remove();
    });
    
    // Trigger file picker
    document.body.appendChild(fileInput);
    fileInput.click();
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
      try {
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
          this.showNotification('Failed to create template. Storage may be full.', 'error');
        }
      } catch (error) {
        console.error('Ez Gmail: Error creating template:', error);
        this.showNotification('Error creating template. Please try again.', 'error');
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
    
    // Get profiles for selector (if profile manager is available)
    const profiles = this.profileManager ? this.profileManager.getAllProfiles() : [];
    const activeProfile = this.profileManager ? this.profileManager.getActiveProfile() : null;
    
    modal.innerHTML = `
      <div class="ez-variable-modal-content">
        <div class="ez-variable-modal-header">
          <h3>Fill in Template Variables</h3>
          <div class="ez-profile-selector-container">
            <label for="ez-profile-select">Profile:</label>
            <select id="ez-profile-select" class="ez-profile-select">
              <option value="">None (Enter manually)</option>
              ${profiles.map(p => `
                <option value="${p.id}" ${activeProfile?.id === p.id ? 'selected' : ''}>
                  ${this.escapeHtml(p.name)}
                </option>
              `).join('')}
            </select>
            <button class="ez-profile-manage-btn" title="Manage Profiles">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="ez-variable-modal-body">
          ${template.variables.map(variable => {
            const isDate = this.isDateVariable(variable);
            return `
              <div class="ez-variable-input-group">
                <label class="ez-variable-label" for="var-${variable}">
                  ${this.formatVariableName(variable)}
                </label>
                <input 
                  type="${isDate ? 'date' : 'text'}" 
                  class="ez-variable-input" 
                  id="var-${variable}"
                  data-variable="${variable}"
                  placeholder="${isDate ? '' : 'Enter ' + variable + '...'}"
                />
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="ez-variable-modal-footer">
          <button class="ez-variable-btn ez-variable-btn-save-profile" title="Save these values as a profile">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            Save as Profile
          </button>
          <div class="ez-variable-modal-footer-right">
            <button class="ez-variable-btn ez-variable-btn-cancel">Cancel</button>
            <button class="ez-variable-btn ez-variable-btn-insert">Insert Template</button>
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  // Setup variable modal event listeners
  setupVariableModalEvents(modal, template) {
    // Profile selector change
    const profileSelect = modal.querySelector('#ez-profile-select');
    if (profileSelect && this.profileManager) {
      profileSelect.addEventListener('change', (e) => {
        const profileId = e.target.value;
        if (profileId) {
          this.fillVariablesFromProfile(modal, profileId);
        }
      });
      
      // Auto-fill from active profile on load
      const activeProfile = this.profileManager.getActiveProfile();
      if (activeProfile) {
        this.fillVariablesFromProfile(modal, activeProfile.id);
      }
    }
    
    // Manage profiles button
    const manageBtn = modal.querySelector('.ez-profile-manage-btn');
    if (manageBtn && this.profileManager) {
      manageBtn.addEventListener('click', () => {
        this.showProfileManagementModal();
      });
    }
    
    // Save as Profile button
    const saveProfileBtn = modal.querySelector('.ez-variable-btn-save-profile');
    if (saveProfileBtn && this.profileManager) {
      saveProfileBtn.addEventListener('click', () => {
        const values = this.getVariableValues(modal);
        this.showSaveProfileModal(values);
      });
    }
    
    // Cancel button
    const cancelBtn = modal.querySelector('.ez-variable-btn-cancel');
    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    // Insert button
    const insertBtn = modal.querySelector('.ez-variable-btn-insert');
    insertBtn.addEventListener('click', async () => {
      const values = this.getVariableValues(modal);
      
      // Auto-save to "Default" profile if no profiles exist
      if (this.profileManager && this.profileManager.getAllProfiles().length === 0) {
        try {
          await this.profileManager.createProfile({
            name: 'Default',
            variables: values,
            isDefault: true
          });
          console.log('Ez Gmail: Auto-created Default profile');
        } catch (error) {
          console.error('Ez Gmail: Error auto-creating Default profile:', error);
        }
      }
      
      await this.insertTemplate(template, values);
      modal.remove();
    });
    
    // Enter key to insert
    modal.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const values = this.getVariableValues(modal);
        
        // Auto-save to "Default" profile if no profiles exist
        if (this.profileManager && this.profileManager.getAllProfiles().length === 0) {
          try {
            await this.profileManager.createProfile({
              name: 'Default',
              variables: values,
              isDefault: true
            });
            console.log('Ez Gmail: Auto-created Default profile');
          } catch (error) {
            console.error('Ez Gmail: Error auto-creating Default profile:', error);
          }
        }
        
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
      let value = input.value;
      
      // Format date values nicely
      if (input.type === 'date' && value) {
        value = this.formatDateValue(value);
      }
      
      values[variable] = value;
    });
    
    return values;
  }

  // Format date value from YYYY-MM-DD to readable format
  formatDateValue(dateString) {
    try {
      const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString; // Return original if formatting fails
    }
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

  // Check if variable is date-related
  isDateVariable(variable) {
    const dateKeywords = [
      'date', 'Date',
      'day', 'Day',
      'deadline', 'Deadline',
      'start', 'Start',
      'end', 'End',
      'return', 'Return',
      'due', 'Due',
      'expiration', 'Expiration',
      'followup', 'followUp', 'FollowUp'
    ];
    
    return dateKeywords.some(keyword => variable.toLowerCase().includes(keyword.toLowerCase()));
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

  // Load sample templates
  async loadSampleTemplates(category = 'all') {
    try {
      const count = await this.templateManager.importPrebuiltTemplates(category);
      
      if (count > 0) {
        const categoryName = category === 'all' ? 'sample' : category;
        this.showNotification(`Successfully loaded ${count} ${categoryName} template${count !== 1 ? 's' : ''}!`, 'success');
        // Refresh the template list
        this.filterAndRenderTemplates();
      } else if (count === 0) {
        this.showNotification('All templates from this category are already loaded', 'success');
      } else {
        this.showNotification('Failed to load templates', 'error');
      }
    } catch (error) {
      console.error('Ez Gmail: Error loading sample templates:', error);
      this.showNotification('Error loading templates', 'error');
    }
  }

  // Fill variables from profile
  fillVariablesFromProfile(modal, profileId) {
    if (!this.profileManager) return;
    
    const profile = this.profileManager.getProfile(profileId);
    if (!profile) return;
    
    const inputs = modal.querySelectorAll('.ez-variable-input');
    inputs.forEach(input => {
      const variable = input.dataset.variable;
      if (profile.variables[variable]) {
        input.value = profile.variables[variable];
      }
    });
    
    console.log('Ez Gmail: Filled variables from profile:', profile.name);
  }

  // Show save profile modal
  showSaveProfileModal(variables) {
    if (!this.profileManager) {
      this.showNotification('Profile system not available', 'error');
      return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'ez-variable-modal';
    modal.id = 'ez-save-profile-modal';
    
    modal.innerHTML = `
      <div class="ez-variable-modal-content" style="max-width: 500px;">
        <div class="ez-variable-modal-header">
          <h3>Save as Profile</h3>
        </div>
        
        <div class="ez-variable-modal-body">
          <div class="ez-variable-input-group">
            <label class="ez-variable-label" for="profile-name">Profile Name</label>
            <input 
              type="text" 
              class="ez-variable-input" 
              id="profile-name" 
              placeholder="e.g., Work, Personal, Consultant..."
              required
            />
          </div>
          <div class="ez-variable-input-group">
            <label class="ez-variable-label">
              <input type="checkbox" id="profile-set-default" />
              Set as default profile
            </label>
          </div>
        </div>
        
        <div class="ez-variable-modal-footer">
          <button class="ez-variable-btn ez-variable-btn-cancel">Cancel</button>
          <button class="ez-variable-btn ez-variable-btn-insert">Save Profile</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    const cancelBtn = modal.querySelector('.ez-variable-btn-cancel');
    cancelBtn.addEventListener('click', () => modal.remove());
    
    const saveBtn = modal.querySelector('.ez-variable-btn-insert');
    saveBtn.addEventListener('click', async () => {
      const name = modal.querySelector('#profile-name').value.trim();
      const isDefault = modal.querySelector('#profile-set-default').checked;
      
      if (!name) {
        this.showNotification('Please enter a profile name', 'error');
        return;
      }
      
      try {
        const profile = await this.profileManager.createProfile({
          name,
          variables,
          isDefault
        });
        
        if (profile) {
          this.showNotification(`Profile "${name}" saved successfully!`, 'success');
          modal.remove();
          
          // Set as active profile
          await this.profileManager.setActiveProfile(profile.id);
          
          // Refresh the variable modal if it's open to update profile dropdown
          const variableModal = document.getElementById('ez-variable-modal');
          if (variableModal) {
            // Close and reopen to refresh
            const currentTemplate = this.currentTemplate;
            if (currentTemplate) {
              variableModal.remove();
              this.showVariableModal(currentTemplate);
            }
          }
        } else {
          this.showNotification('Failed to save profile', 'error');
        }
      } catch (error) {
        console.error('Ez Gmail: Error saving profile:', error);
        this.showNotification('Error saving profile', 'error');
      }
    });
    
    // Focus name input
    setTimeout(() => modal.querySelector('#profile-name').focus(), 100);
  }

  // Show profile management modal
  showProfileManagementModal() {
    if (!this.profileManager) {
      this.showNotification('Profile system not available', 'error');
      return;
    }
    
    const profiles = this.profileManager.getAllProfiles();
    const activeProfile = this.profileManager.getActiveProfile();
    
    const modal = document.createElement('div');
    modal.className = 'ez-template-modal';
    modal.id = 'ez-profile-management-modal';
    
    modal.innerHTML = `
      <div class="ez-template-modal-content">
        <div class="ez-template-modal-header">
          <h2>Manage Profiles</h2>
          <button class="ez-template-modal-close" aria-label="Close">&times;</button>
        </div>
        
        <div class="ez-template-list" id="ez-profile-list">
          ${profiles.length === 0 ? `
            <div class="ez-template-empty">
              <div class="ez-template-empty-icon">👤</div>
              <div class="ez-template-empty-text">No profiles yet</div>
              <div class="ez-template-empty-subtext">Create a profile to save your information</div>
            </div>
          ` : profiles.map(profile => `
            <div class="ez-template-item" data-profile-id="${profile.id}">
              <div class="ez-template-item-header">
                <span class="ez-template-item-name">
                  ${this.escapeHtml(profile.name)}
                  ${profile.isDefault ? ' <span style="color: #1a73e8;">(Default)</span>' : ''}
                  ${activeProfile?.id === profile.id ? ' <span style="color: #34a853;">●</span>' : ''}
                </span>
              </div>
              <div class="ez-template-item-footer">
                <span>${Object.keys(profile.variables).length} variables</span>
                <div class="ez-template-item-actions">
                  <button class="ez-template-action-btn ez-profile-set-active" data-profile-id="${profile.id}" title="Set as active">
                    Use
                  </button>
                  <button class="ez-template-action-btn ez-profile-delete" data-profile-id="${profile.id}" title="Delete profile">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    const closeBtn = modal.querySelector('.ez-template-modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    // Set active profile
    modal.addEventListener('click', async (e) => {
      const setActiveBtn = e.target.closest('.ez-profile-set-active');
      if (setActiveBtn) {
        const profileId = setActiveBtn.dataset.profileId;
        await this.profileManager.setActiveProfile(profileId);
        const profile = this.profileManager.getProfile(profileId);
        this.showNotification(`Active profile set to "${profile.name}"`, 'success');
        modal.remove();
      }
      
      // Delete profile
      const deleteBtn = e.target.closest('.ez-profile-delete');
      if (deleteBtn) {
        const profileId = deleteBtn.dataset.profileId;
        const profile = this.profileManager.getProfile(profileId);
        
        if (confirm(`Delete profile "${profile.name}"?`)) {
          await this.profileManager.deleteProfile(profileId);
          this.showNotification(`Profile "${profile.name}" deleted`, 'success');
          modal.remove();
        }
      }
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
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
