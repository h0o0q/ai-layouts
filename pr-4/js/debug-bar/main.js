class DebugBar {
  constructor({
    storageKey = 'hugo.debug_bar',
    toggleId = 'hdb-toggle',
    barId = 'hdb'
  } = {}) {
    this.storageKey = storageKey;
    this.toggle = document.getElementById(toggleId);
    this.debugBar = document.getElementById(barId);
    this.detailsList = document.querySelectorAll('details');

    if (!this.debugBar) return;

    this.initialize();
  }

  initialize() {
    const isVisible = this.getStoredVisibility();
    this.setVisibility(isVisible);
    this.bindEvents();
  }

  bindEvents() {
    if (this.toggle) {
      this.toggle.addEventListener('click', this.handleToggleClick.bind(this));
    }

    this.detailsList.forEach(details => {
      details.addEventListener('toggle', this.handleDetailsToggle.bind(this));
    });
  }

  safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }

  getStoredVisibility() {
    const raw = this.safeGet(this.storageKey);
    if (raw === null) return true;
    try {
      return JSON.parse(raw);
    } catch {
      return true;
    }
  }

  setStoredVisibility(visible) {
    this.safeSet(this.storageKey, JSON.stringify(visible));
  }

  setVisibility(visible) {
    if (visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    const computed = getComputedStyle(this.debugBar);
    this.debugBar.style.display = '';
    this.debugBar.style.opacity = 1;
  }

  hide() {
    this.debugBar.style.opacity = 0;
    setTimeout(() => {
      this.debugBar.style.display = 'none';
    }, 300);
  }

  setAria(element, isOpen) {
    if (element) {
      element.setAttribute('aria-expanded', String(isOpen));
    }
  }

  handleToggleClick(event) {
    event.preventDefault();
    const nowVisible = !this.getStoredVisibility();
    this.setStoredVisibility(nowVisible);
    this.setVisibility(nowVisible);
    this.setAria(this.toggle, nowVisible);
  }

  handleDetailsToggle(event) {
    const current = event.target;
    if (!current.open) {
      this.setAria(current.querySelector('summary'), false);
      return;
    }

    this.detailsList.forEach(details => {
      const isOpen = details === current;
      details.open = isOpen;
      this.setAria(details.querySelector('summary'), isOpen);
    });
  }
}

// Initialize automatically
document.addEventListener('DOMContentLoaded', () => new DebugBar());
