// Ez Gmail - Template Manager
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Email template management system with variables and categories

class TemplateManager {
  constructor() {
    this.templates = [];
    this.categories = ['Work', 'Personal', 'Support', 'Sales', 'Follow-up', 'Signature', 'Other'];
    this.storageKey = 'ezgmail_templates';
    this.initialized = false;
  }

  // Initialize template manager
  async init() {
    if (this.initialized) return;
    
    console.log('Ez Gmail: Initializing Template Manager...');
    await this.loadTemplates();
    this.initialized = true;
    console.log('Ez Gmail: Template Manager initialized with', this.templates.length, 'templates');
  }

  // Load templates from Chrome storage
  async loadTemplates() {
    try {
      const result = await chrome.storage.local.get(this.storageKey);
      this.templates = result[this.storageKey] || [];
      
      // Ensure all templates have required fields
      this.templates = this.templates.map(template => ({
        id: template.id || this.generateId(),
        name: template.name || 'Untitled',
        subject: template.subject || '',
        body: template.body || '',
        category: template.category || 'Other',
        variables: template.variables || [],
        created: template.created || new Date().toISOString(),
        modified: template.modified || new Date().toISOString(),
        usageCount: template.usageCount || 0
      }));
      
      return this.templates;
    } catch (error) {
      console.error('Ez Gmail: Error loading templates:', error);
      return [];
    }
  }

  // Save templates to Chrome storage
  async saveTemplates() {
    try {
      // Check storage size before saving (local storage has 5MB+ limit)
      const dataSize = JSON.stringify(this.templates).length;
      const maxSize = 5 * 1024 * 1024; // 5MB limit for local storage
      
      if (dataSize > maxSize) {
        console.error('Ez Gmail: Storage quota exceeded. Data size:', dataSize, 'Max:', maxSize);
        throw new Error('Storage quota exceeded. Please delete some templates.');
      }
      
      await chrome.storage.local.set({ [this.storageKey]: this.templates });
      console.log('Ez Gmail: Templates saved successfully. Size:', dataSize, 'bytes (', Math.round(dataSize / 1024), 'KB )');
      return true;
    } catch (error) {
      console.error('Ez Gmail: Error saving templates:', error);
      
      // Show user-friendly error
      if (error.message && error.message.includes('quota')) {
        alert('Ez Gmail: Storage limit reached!\n\nYou have too many templates. Please delete some templates to free up space.');
      }
      
      return false;
    }
  }

  // Create new template
  async createTemplate(templateData) {
    const template = {
      id: this.generateId(),
      name: templateData.name || 'Untitled Template',
      subject: templateData.subject || '',
      body: templateData.body || '',
      category: templateData.category || 'Other',
      variables: this.extractVariables(templateData.subject + ' ' + templateData.body),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      usageCount: 0
    };

    this.templates.push(template);
    await this.saveTemplates();
    
    console.log('Ez Gmail: Template created:', template.name);
    return template;
  }

  // Update existing template
  async updateTemplate(id, updates) {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      console.error('Ez Gmail: Template not found:', id);
      return null;
    }

    const template = this.templates[index];
    const updatedTemplate = {
      ...template,
      ...updates,
      modified: new Date().toISOString(),
      variables: this.extractVariables((updates.subject || template.subject) + ' ' + (updates.body || template.body))
    };

    this.templates[index] = updatedTemplate;
    await this.saveTemplates();
    
    console.log('Ez Gmail: Template updated:', updatedTemplate.name);
    return updatedTemplate;
  }

  // Delete template
  async deleteTemplate(id) {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      console.error('Ez Gmail: Template not found:', id);
      return false;
    }

    const template = this.templates[index];
    this.templates.splice(index, 1);
    await this.saveTemplates();
    
    console.log('Ez Gmail: Template deleted:', template.name);
    return true;
  }

  // Get template by ID
  getTemplate(id) {
    return this.templates.find(t => t.id === id);
  }

  // Get all templates
  getAllTemplates() {
    return [...this.templates];
  }

  // Get templates by category
  getTemplatesByCategory(category) {
    return this.templates.filter(t => t.category === category);
  }

  // Search templates
  searchTemplates(query) {
    const lowerQuery = query.toLowerCase();
    return this.templates.filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.subject.toLowerCase().includes(lowerQuery) ||
      t.body.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
    );
  }

  // Increment usage count
  async incrementUsage(id) {
    const template = this.getTemplate(id);
    if (!template) return;

    template.usageCount++;
    await this.saveTemplates();
  }

  // Get most used templates
  getMostUsed(limit = 5) {
    return [...this.templates]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  // Extract variables from text
  extractVariables(text) {
    const variablePattern = /\{\{(\w+)\}\}/g;
    const variables = new Set();
    let match;

    while ((match = variablePattern.exec(text)) !== null) {
      variables.add(match[1]);
    }

    return Array.from(variables);
  }

  // Replace variables in text
  replaceVariables(text, values) {
    let result = text;
    
    // Replace each variable with its value
    Object.keys(values).forEach(key => {
      const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(pattern, values[key] || '');
    });

    // Replace any remaining variables with empty string
    result = result.replace(/\{\{\w+\}\}/g, '');

    return result;
  }

  // Get template with variables replaced
  getTemplateWithValues(id, values) {
    const template = this.getTemplate(id);
    if (!template) return null;

    return {
      ...template,
      subject: this.replaceVariables(template.subject, values),
      body: this.replaceVariables(template.body, values)
    };
  }

  // Generate unique ID
  generateId() {
    return 'tpl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get available categories
  getCategories() {
    return [...this.categories];
  }

  // Add custom category
  addCategory(category) {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
      return true;
    }
    return false;
  }

  // Export templates to JSON
  exportTemplates() {
    return JSON.stringify(this.templates, null, 2);
  }

  // Import templates from JSON
  async importTemplates(jsonString, merge = false) {
    try {
      const imported = JSON.parse(jsonString);
      
      if (!Array.isArray(imported)) {
        throw new Error('Invalid template data');
      }

      if (merge) {
        // Merge with existing templates (avoid duplicates by name)
        const existingNames = new Set(this.templates.map(t => t.name));
        const newTemplates = imported.filter(t => !existingNames.has(t.name));
        this.templates.push(...newTemplates);
      } else {
        // Replace all templates
        this.templates = imported;
      }

      await this.saveTemplates();
      console.log('Ez Gmail: Templates imported successfully');
      return true;
    } catch (error) {
      console.error('Ez Gmail: Error importing templates:', error);
      return false;
    }
  }

  // Get template statistics
  getStatistics() {
    const byCategory = {};
    this.categories.forEach(cat => {
      byCategory[cat] = this.templates.filter(t => t.category === cat).length;
    });

    return {
      total: this.templates.length,
      byCategory,
      totalUsage: this.templates.reduce((sum, t) => sum + t.usageCount, 0),
      mostUsed: this.getMostUsed(5)
    };
  }

  // Import prebuilt templates from library
  async importPrebuiltTemplates(category = 'all') {
    try {
      // Check if TEMPLATE_LIBRARY is available
      if (typeof TEMPLATE_LIBRARY === 'undefined') {
        console.error('Ez Gmail: Template library not loaded');
        return false;
      }

      let templatesToImport = [];

      if (category === 'all') {
        // Import all categories
        Object.values(TEMPLATE_LIBRARY).forEach(categoryTemplates => {
          templatesToImport = templatesToImport.concat(categoryTemplates);
        });
      } else if (TEMPLATE_LIBRARY[category]) {
        // Import specific category
        templatesToImport = TEMPLATE_LIBRARY[category];
      } else {
        console.error('Ez Gmail: Invalid category:', category);
        return false;
      }

      // Import templates (merge with existing)
      const existingNames = new Set(this.templates.map(t => t.name));
      let importedCount = 0;

      for (const template of templatesToImport) {
        // Skip if template with same name already exists
        if (existingNames.has(template.name)) {
          continue;
        }

        // Create template
        await this.createTemplate(template);
        importedCount++;
      }

      console.log(`Ez Gmail: Imported ${importedCount} prebuilt templates`);
      return importedCount;
    } catch (error) {
      console.error('Ez Gmail: Error importing prebuilt templates:', error);
      return false;
    }
  }

  // Check if user has any templates
  hasTemplates() {
    return this.templates.length > 0;
  }

  // Get available prebuilt categories
  getPrebuiltCategories() {
    if (typeof TEMPLATE_LIBRARY === 'undefined') {
      return [];
    }
    return Object.keys(TEMPLATE_LIBRARY);
  }

  // Get count of prebuilt templates by category
  getPrebuiltCount(category = 'all') {
    if (typeof TEMPLATE_LIBRARY === 'undefined') {
      return 0;
    }

    if (category === 'all') {
      return Object.values(TEMPLATE_LIBRARY).reduce((sum, templates) => sum + templates.length, 0);
    }

    return TEMPLATE_LIBRARY[category] ? TEMPLATE_LIBRARY[category].length : 0;
  }

  // Get storage usage information
  getStorageUsage() {
    const dataSize = JSON.stringify(this.templates).length;
    const maxSize = 5 * 1024 * 1024; // 5MB for local storage
    const percentUsed = Math.round((dataSize / maxSize) * 100);
    
    return {
      used: dataSize,
      usedKB: Math.round(dataSize / 1024),
      max: maxSize,
      maxMB: Math.round(maxSize / 1024 / 1024),
      available: maxSize - dataSize,
      percentUsed: percentUsed,
      isNearLimit: percentUsed > 80,
      isAtLimit: percentUsed > 95
    };
  }

  // Check if storage is near limit
  isStorageNearLimit() {
    const usage = this.getStorageUsage();
    return usage.isNearLimit;
  }

  // Get template statistics
  getTemplateStats() {
    const stats = {
      total: this.templates.length,
      byCategory: {},
      withVariables: 0,
      totalVariables: 0
    };

    this.templates.forEach(template => {
      // Count by category
      if (!stats.byCategory[template.category]) {
        stats.byCategory[template.category] = 0;
      }
      stats.byCategory[template.category]++;

      // Count templates with variables
      if (template.variables && template.variables.length > 0) {
        stats.withVariables++;
        stats.totalVariables += template.variables.length;
      }
    });

    return stats;
  }

  // Duplicate template
  async duplicateTemplate(id) {
    const original = this.getTemplate(id);
    if (!original) return null;

    const duplicate = {
      ...original,
      id: this.generateId(),
      name: original.name + ' (Copy)',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      usageCount: 0
    };

    this.templates.push(duplicate);
    await this.saveTemplates();
    
    console.log('Ez Gmail: Template duplicated:', duplicate.name);
    return duplicate;
  }
}

// Create global instance
window.ezGmailTemplateManager = new TemplateManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TemplateManager;
}
