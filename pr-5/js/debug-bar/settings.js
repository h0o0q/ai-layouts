class DebugBarSettings {
  constructor({
    storageKey = 'hugo.debug_bar_settings',
    barId = 'hdb'
  } = {}) {
    this.storageKey = storageKey;
    this.debugBar = document.getElementById(barId);
    if (!this.debugBar) return;

    this.settingsMap = [
      { inputId: "hdb-bg-color",   key: "bg_color",            css: "--hdb-bg-color" },
      { inputId: "hdb-bg-color-inner", key: "bg_color_inner",  css: "--hdb-bg-color-inner" },
      { inputId: "hdb-color",      key: "color",               css: "--hdb-color" },
      { inputId: "hdb-color-hover", key: "color_hover",        css: "--hdb-color-hover" },
      { inputId: "hdb-color-current-menu", key: "color_current_menu", css: "--hdb-color-current-menu" },
      { inputId: "hdb-color-print-value", key: "color_print_value", css: "--hdb-color-print-value" },
      { inputId: "hdb-color-print-bool-true", key: "color_print_bool_true", css: "--hdb-color-print-bool-true" },
      { inputId: "hdb-color-print-bool-false", key: "color_print_bool_false", css: "--hdb-color-print-bool-false" },
      { inputId: "hdb-border-color", key: "border_color",      css: "--hdb-border-color" },
      { inputId: "hdb-border-color-table", key: "border_color_table", css: "--hdb-border-color-table" }
    ];

    this.inputs = {};
    this.settingsMap.forEach(({ inputId }) => {
      this.inputs[inputId] = document.getElementById(inputId);
    });
    this.form = document.getElementById("hdb-settings-form");

    this.setDefaultValues();
    this.initialize();
  }

  initialize() {
    const settings = this.getStoredSettings();
    this.applySettings(settings);
    this.bindEvents();
  }

  handleSettingChange(event, mapItem) {
    event.preventDefault();
    const settings = this.getStoredSettings();
    settings[mapItem.key] = String(event.target.value);
    this.setStoredSettings(settings);
    this.debugBar.style.setProperty(mapItem.css, event.target.value);
  }

  handleReset(event) {
    event.preventDefault();
    this.safeRemove(this.storageKey);
    event.target.submit();
  }

  bindEvents() {
    this.settingsMap.forEach(mapItem => {
      const input = this.inputs[mapItem.inputId];
      if (input) {
        input.addEventListener('input', e => this.handleSettingChange(e, mapItem));
      }
    });
    this.form && this.form.addEventListener('submit', this.handleReset.bind(this));
  }

  safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      console.error("Error getting key", key);
      return null;
    }
  }

  safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.error("Error setting key", key);
    }
  }

  safeRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error("Error removing key", key);
    }
  }

  getStoredSettings() {
    const raw = this.safeGet(this.storageKey);
    if (raw === null) return {};
    try {
      return JSON.parse(raw);
    } catch {
      console.error("Error parsing stored object settings");
      return {};
    }
  }

  setStoredSettings(settings) {
    this.safeSet(this.storageKey, JSON.stringify(settings));
  }

  setDefaultValues() {
    const computed = getComputedStyle(this.debugBar);
    this.defaults = {};
    this.settingsMap.forEach(({ key, css, inputId }) => {
      const defaultValue = computed.getPropertyValue(css).trim();
      this.defaults[key] = defaultValue;
      const input = this.inputs[inputId];
      if (input) input.value = defaultValue;
    });
  }

  applySettings(settings) {
    this.settingsMap.forEach(({ key, css, inputId }) => {
      const val = (settings && settings[key]) ? settings[key] : this.defaults[key];
      this.debugBar.style.setProperty(css, val);
      const input = this.inputs[inputId];
      if (input) input.value = val.trim();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new DebugBarSettings());
