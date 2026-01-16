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
          <button class="btn" onclick="loadSampleTemplates()">
            Load Sample Templates
          </button>
        ` : ''}
      </div>
    `;
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
      <button class="template-action-btn" onclick="editTemplate('${template.id}')">
        Edit
      </button>
      <button class="template-action-btn" onclick="duplicateTemplate('${template.id}')">
        Duplicate
      </button>
      <button class="template-action-btn" onclick="deleteTemplate('${template.id}')">
        Delete
      </button>
    </div>
  `;
  
  return card;
}

// Update statistics
function updateStats() {
  const templates = templateManager.getAllTemplates();
  const stats = templateManager.getTemplateStats();
  
  document.getElementById('totalTemplates').textContent = templates.length;
  document.getElementById('totalCategories').textContent = Object.keys(stats.byCategory).length;
  
  // Calculate storage usage
  const usage = templateManager.getStorageUsage();
  const percentage = ((usage.used / usage.total) * 100).toFixed(1);
  document.getElementById('storageUsed').textContent = percentage + '%';
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
  
  // Create template button
  document.getElementById('createTemplateBtn').addEventListener('click', createTemplate);
  
  // Load samples button
  document.getElementById('loadSamplesBtn').addEventListener('click', loadSampleTemplates);
}

// Create new template
function createTemplate() {
  const name = prompt('Template Name:');
  if (!name) return;
  
  const category = prompt('Category (work/personal/sales/support/signature):');
  if (!category) return;
  
  const subject = prompt('Email Subject:');
  if (!subject) return;
  
  const body = prompt('Email Body:');
  if (!body) return;
  
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
  } else {
    alert('Failed to create template');
  }
}

// Edit template
function editTemplate(id) {
  const template = templateManager.getTemplate(id);
  if (!template) return;
  
  const name = prompt('Template Name:', template.name);
  if (!name) return;
  
  const category = prompt('Category:', template.category);
  if (!category) return;
  
  const subject = prompt('Email Subject:', template.subject);
  if (!subject) return;
  
  const body = prompt('Email Body:', template.body);
  if (!body) return;
  
  const updated = templateManager.updateTemplate(id, {
    name,
    category,
    subject,
    body
  });
  
  if (updated) {
    alert('Template updated successfully!');
    loadTemplates();
  } else {
    alert('Failed to update template');
  }
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
  if (confirm('Load sample templates? This will add prebuilt templates to your collection.')) {
    const imported = await templateManager.importTemplates(TEMPLATE_LIBRARY);
    
    if (imported > 0) {
      alert(`${imported} sample templates loaded successfully!`);
      loadTemplates();
      updateStats();
      populateCategoryFilter();
    } else {
      alert('All sample templates are already loaded');
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
