// Ez Gmail - Templates Management Page
// Ez IT Solutions - http://www.Ez-IT-Solutions.com

let templateManager;
let currentFilter = 'all';
let searchQuery = '';

// Initialize page
async function init() {
  templateManager = new TemplateManager();
  await templateManager.init();
  
  // Load templates
  await loadTemplates();
  
  // Update stats
  updateStats();
  
  // Setup event listeners
  setupEventListeners();
  
  // Populate category filter
  populateCategoryFilter();
}

// Load and display templates
async function loadTemplates() {
  const templates = templateManager.getAllTemplates();
  const grid = document.getElementById('templatesGrid');
  
  // Filter templates
  let filteredTemplates = templates;
  
  if (currentFilter !== 'all') {
    filteredTemplates = templates.filter(t => t.category === currentFilter);
  }
  
  if (searchQuery) {
    filteredTemplates = filteredTemplates.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Clear grid
  grid.innerHTML = '';
  
  // Show empty state if no templates
  if (filteredTemplates.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">📝</div>
        <div class="empty-text">No templates found</div>
        <div class="empty-subtext">
          ${templates.length === 0 
            ? 'Create your first template or load sample templates to get started' 
            : 'Try adjusting your search or filter'}
        </div>
        ${templates.length === 0 ? `
          <button class="btn" id="emptyStateLoadBtn">
            Load Sample Templates
          </button>
        ` : ''}
      </div>
    `;
    
    // Add event listener for empty state button if it exists
    if (templates.length === 0) {
      setTimeout(() => {
        const emptyBtn = document.getElementById('emptyStateLoadBtn');
        if (emptyBtn) {
          emptyBtn.addEventListener('click', loadSampleTemplates);
        }
      }, 0);
    }
    
    return;
  }
  
  // Render templates
  filteredTemplates.forEach(template => {
    const card = createTemplateCard(template);
    grid.appendChild(card);
  });
}

// Create template card element
function createTemplateCard(template) {
  const card = document.createElement('div');
  card.className = 'template-card';
  card.dataset.templateId = template.id;
  
  const preview = template.body.replace(/<[^>]*>/g, '').substring(0, 100);
  
  card.innerHTML = `
    <div class="template-card-header">
      <div>
        <div class="template-name">${escapeHtml(template.name)}</div>
        <div class="template-category">${escapeHtml(template.category)}</div>
      </div>
    </div>
    <div class="template-subject">${escapeHtml(template.subject)}</div>
    <div class="template-preview">${escapeHtml(preview)}...</div>
    <div class="template-actions">
      <button class="template-action-btn" data-action="edit">
        Edit
      </button>
      <button class="template-action-btn" data-action="duplicate">
        Duplicate
      </button>
      <button class="template-action-btn" data-action="delete">
        Delete
      </button>
    </div>
  `;
  
  return card;
}

// Update statistics
function updateStats() {
  try {
    const templates = templateManager.getAllTemplates();
    
    // Get stats (with fallback if method doesn't exist)
    let stats;
    if (typeof templateManager.getTemplateStats === 'function') {
      stats = templateManager.getTemplateStats();
    } else {
      // Fallback: calculate stats manually
      stats = {
        total: templates.length,
        byCategory: {}
      };
      templates.forEach(t => {
        if (!stats.byCategory[t.category]) {
          stats.byCategory[t.category] = 0;
        }
        stats.byCategory[t.category]++;
      });
    }
    
    document.getElementById('totalTemplates').textContent = templates.length;
    document.getElementById('totalCategories').textContent = Object.keys(stats.byCategory).length;
    
    // Calculate storage usage
    const usage = templateManager.getStorageUsage();
    let percentage = 0;
    if (usage && usage.used !== undefined && usage.total && usage.total > 0) {
      percentage = ((usage.used / usage.total) * 100).toFixed(1);
    }
    document.getElementById('storageUsed').textContent = percentage + '%';
  } catch (error) {
    console.error('Error updating stats:', error);
    // Set default values on error
    document.getElementById('totalTemplates').textContent = '0';
    document.getElementById('totalCategories').textContent = '0';
    document.getElementById('storageUsed').textContent = '0%';
  }
}

// Populate category filter
function populateCategoryFilter() {
  const filter = document.getElementById('categoryFilter');
  const categories = templateManager.getCategories();
  
  // Clear existing options except "All"
  filter.innerHTML = '<option value="all">All Categories</option>';
  
  // Add category options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    filter.appendChild(option);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Search input
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    loadTemplates();
  });
  
  // Category filter
  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    currentFilter = e.target.value;
    loadTemplates();
  });
  
  // Create new template button
  document.getElementById('createTemplateBtn').addEventListener('click', createTemplate);
  
  // Load samples button
  document.getElementById('loadSamplesBtn').addEventListener('click', loadSampleTemplates);
  
  // Reimport all button
  document.getElementById('reimportAllBtn').addEventListener('click', reimportAllTemplates);
  
  // Template action buttons (using event delegation)
  document.getElementById('templatesGrid').addEventListener('click', (e) => {
    const actionBtn = e.target.closest('.template-action-btn');
    if (!actionBtn) return;
    
    const card = actionBtn.closest('.template-card');
    if (!card) return;
    
    const templateId = card.dataset.templateId;
    const action = actionBtn.dataset.action;
    
    console.log('Template action clicked:', action, 'ID:', templateId);
    
    switch (action) {
      case 'edit':
        editTemplate(templateId);
        break;
      case 'duplicate':
        duplicateTemplate(templateId);
        break;
      case 'delete':
        deleteTemplate(templateId);
        break;
    }
  });
}

// Create new template
function createTemplate() {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'ez-template-modal';
  modal.innerHTML = `
    <div class="ez-template-modal-content" style="max-width: 600px;">
      <div class="ez-template-modal-header">
        <h2>Create New Template</h2>
        <button class="ez-template-modal-close" id="createModalClose">&times;</button>
      </div>
      <div style="padding: 24px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Template Name *</label>
          <input type="text" id="createName" placeholder="e.g., Meeting Follow-up"
                 style="width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Category *</label>
          <select id="createCategory" style="width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px;">
            ${templateManager.getCategories().map(cat => 
              `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
            ).join('')}
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email Subject</label>
          <input type="text" id="createSubject" placeholder="e.g., Re: {{projectName}}"
                 style="width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email Body *</label>
          <textarea id="createBody" rows="10" placeholder="Use {{variableName}} for dynamic content..."
                    style="width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; font-family: monospace;"></textarea>
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="btn btn-secondary" id="createCancelBtn">Cancel</button>
          <button class="btn" id="createSaveBtn">Create Template</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Event listeners
  const closeModal = () => modal.remove();
  
  document.getElementById('createModalClose').addEventListener('click', closeModal);
  document.getElementById('createCancelBtn').addEventListener('click', closeModal);
  
  document.getElementById('createSaveBtn').addEventListener('click', () => {
    const name = document.getElementById('createName').value.trim();
    const category = document.getElementById('createCategory').value;
    const subject = document.getElementById('createSubject').value.trim();
    const body = document.getElementById('createBody').value.trim();
    
    if (!name || !body) {
      alert('Please fill in template name and body');
      return;
    }
    
    const template = templateManager.createTemplate({
      name,
      category,
      subject,
      body
    });
    
    if (template) {
      alert('Template created successfully!');
      loadTemplates();
      updateStats();
      populateCategoryFilter();
      closeModal();
    } else {
      alert('Failed to create template');
    }
  });
  
  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Focus first input
  setTimeout(() => document.getElementById('createName').focus(), 100);
}

// Edit template
function editTemplate(id) {
  console.log('editTemplate called with ID:', id);
  const template = templateManager.getTemplate(id);
  console.log('Template found:', template);
  if (!template) {
    alert('Template not found');
    return;
  }
  
  // Create edit modal
  const modal = document.createElement('div');
  modal.className = 'ez-template-modal';
  modal.innerHTML = `
    <div class="ez-template-modal-content" style="max-width: 600px;">
      <div class="ez-template-modal-header">
        <h2>Edit Template</h2>
        <button class="ez-template-modal-close" id="editModalClose">&times;</button>
      </div>
      <div style="padding: 24px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Template Name</label>
          <input type="text" id="editName" value="${escapeHtml(template.name)}" 
                 style="width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Category</label>
          <select id="editCategory" style="width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px;">
            ${templateManager.getCategories().map(cat => 
              `<option value="${cat}" ${cat === template.category ? 'selected' : ''}>${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
            ).join('')}
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email Subject</label>
          <input type="text" id="editSubject" value="${escapeHtml(template.subject)}"
                 style="width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email Body</label>
          <textarea id="editBody" rows="10"
                    style="width: 100%; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; font-family: monospace;">${escapeHtml(template.body)}</textarea>
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="btn btn-secondary" id="editCancelBtn">Cancel</button>
          <button class="btn" id="editSaveBtn">Save Changes</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Event listeners
  const closeModal = () => modal.remove();
  
  document.getElementById('editModalClose').addEventListener('click', closeModal);
  document.getElementById('editCancelBtn').addEventListener('click', closeModal);
  
  document.getElementById('editSaveBtn').addEventListener('click', () => {
    const name = document.getElementById('editName').value.trim();
    const category = document.getElementById('editCategory').value;
    const subject = document.getElementById('editSubject').value.trim();
    const body = document.getElementById('editBody').value.trim();
    
    if (!name || !body) {
      alert('Please fill in template name and body');
      return;
    }
    
    const updated = templateManager.updateTemplate(id, {
      name,
      category,
      subject,
      body
    });
    
    if (updated) {
      alert('Template updated successfully!');
      loadTemplates();
      updateStats();
      closeModal();
    } else {
      alert('Failed to update template');
    }
  });
  
  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Focus first input
  setTimeout(() => document.getElementById('editName').focus(), 100);
}

// Duplicate template
function duplicateTemplate(id) {
  const template = templateManager.getTemplate(id);
  if (!template) return;
  
  const newTemplate = templateManager.createTemplate({
    name: template.name + ' (Copy)',
    category: template.category,
    subject: template.subject,
    body: template.body
  });
  
  if (newTemplate) {
    alert('Template duplicated successfully!');
    loadTemplates();
    updateStats();
  } else {
    alert('Failed to duplicate template');
  }
}

// Delete template
function deleteTemplate(id) {
  const template = templateManager.getTemplate(id);
  if (!template) return;
  
  if (confirm(`Delete template "${template.name}"?`)) {
    const deleted = templateManager.deleteTemplate(id);
    
    if (deleted) {
      alert('Template deleted successfully!');
      loadTemplates();
      updateStats();
    } else {
      alert('Failed to delete template');
    }
  }
}

// Load sample templates
async function loadSampleTemplates() {
  if (!window.TEMPLATE_LIBRARY) {
    alert('Template library not available. Please refresh the page.');
    return;
  }
  
  if (confirm('Load sample templates? This will add prebuilt templates to your collection.')) {
    try {
      const imported = await templateManager.importTemplates(window.TEMPLATE_LIBRARY);
      
      if (imported > 0) {
        alert(`${imported} sample templates loaded successfully!`);
        loadTemplates();
        updateStats();
        populateCategoryFilter();
      } else {
        alert('All sample templates are already loaded');
      }
    } catch (error) {
      console.error('Error loading sample templates:', error);
      alert('Error loading sample templates. Please try again.');
    }
  }
}

// Reimport/refresh all sample templates (force update)
async function reimportAllTemplates() {
  if (!window.TEMPLATE_LIBRARY) {
    alert('Template library not available. Please refresh the page.');
    return;
  }
  
  if (confirm('Reimport ALL sample templates? This will UPDATE existing templates with the latest versions from the library. Your custom templates will not be affected.')) {
    try {
      // Get all templates from library
      const libraryTemplates = [];
      Object.values(window.TEMPLATE_LIBRARY).forEach(categoryTemplates => {
        if (Array.isArray(categoryTemplates)) {
          libraryTemplates.push(...categoryTemplates);
        }
      });
      
      // Get existing template names from library
      const libraryNames = new Set(libraryTemplates.map(t => t.name));
      
      // Delete existing library templates
      const existingTemplates = templateManager.getAllTemplates();
      let deletedCount = 0;
      for (const template of existingTemplates) {
        if (libraryNames.has(template.name)) {
          await templateManager.deleteTemplate(template.id);
          deletedCount++;
        }
      }
      
      // Import fresh copies
      const imported = await templateManager.importTemplates(window.TEMPLATE_LIBRARY, true);
      
      alert(`Reimported ${imported} templates successfully!\n(${deletedCount} old versions removed)`);
      loadTemplates();
      updateStats();
      populateCategoryFilter();
    } catch (error) {
      console.error('Error reimporting templates:', error);
      alert('Error reimporting templates. Please try again.');
    }
  }
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
