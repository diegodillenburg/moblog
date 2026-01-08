import { injectStyles, removeStyles } from './styles.js';

export class Overlay {
  constructor(options = {}) {
    this.options = {
      maxLines: 200,
      startMinimized: true,
      position: 'bottom-right',
      onCopy: null,
      onClear: null,
      onExport: null,
      onFilterChange: null,
      onSearchChange: null,
      ...options,
    };

    this.logs = [];
    this.element = null;
    this.logsEl = null;
    this.searchEl = null;
    this.lineCountEl = null;
    this.activeFilters = new Set(['log', 'info', 'warn', 'error', 'debug']);
    this.searchText = '';
  }

  create() {
    injectStyles();

    this.element = document.createElement('div');
    this.element.id = 'mlog-overlay';

    if (this.options.startMinimized) {
      this.element.classList.add('mlog-minimized');
    }

    this.element.innerHTML = `
      <div class="mlog-fab-icon">M</div>
      <div class="mlog-header">
        <span class="mlog-title">mlog</span>
        <span class="mlog-line-count">0 lines</span>
        <div class="mlog-controls">
          <button class="mlog-btn" data-action="copy" title="Copy">Copy</button>
          <button class="mlog-btn" data-action="export" title="Export">Export</button>
          <button class="mlog-btn" data-action="clear" title="Clear">Clear</button>
          <button class="mlog-btn" data-action="minimize" title="Minimize">_</button>
        </div>
      </div>
      <div class="mlog-filters">
        <input type="text" class="mlog-search" placeholder="Filter logs...">
        <button class="mlog-filter-btn active" data-level="log">LOG</button>
        <button class="mlog-filter-btn active" data-level="info">INFO</button>
        <button class="mlog-filter-btn active" data-level="warn">WARN</button>
        <button class="mlog-filter-btn active" data-level="error">ERROR</button>
        <button class="mlog-filter-btn active" data-level="debug">DEBUG</button>
      </div>
      <div class="mlog-logs"></div>
    `;

    document.body.appendChild(this.element);

    this.logsEl = this.element.querySelector('.mlog-logs');
    this.searchEl = this.element.querySelector('.mlog-search');
    this.lineCountEl = this.element.querySelector('.mlog-line-count');

    this.bindEvents();
  }

  bindEvents() {
    this.element.addEventListener('click', (e) => {
      if (this.element.classList.contains('mlog-minimized')) {
        this.show();
        return;
      }

      const btn = e.target.closest('.mlog-btn');
      if (btn) {
        const action = btn.dataset.action;
        if (action === 'copy') this.options.onCopy?.();
        if (action === 'export') this.options.onExport?.();
        if (action === 'clear') this.options.onClear?.();
        if (action === 'minimize') this.hide();
      }

      const filterBtn = e.target.closest('.mlog-filter-btn');
      if (filterBtn) {
        const level = filterBtn.dataset.level;
        filterBtn.classList.toggle('active');

        if (filterBtn.classList.contains('active')) {
          this.activeFilters.add(level);
        } else {
          this.activeFilters.delete(level);
        }

        this.options.onFilterChange?.({
          levels: Array.from(this.activeFilters),
          text: this.searchText,
        });

        this.render();
      }
    });

    let searchTimeout;
    this.searchEl.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.searchText = e.target.value.toLowerCase();
        this.options.onSearchChange?.(this.searchText);
        this.render();
      }, 150);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.element.classList.contains('mlog-minimized')) {
        this.hide();
      }
    });

    let lastTap = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        if (!e.target.closest('#mlog-overlay')) {
          this.toggle();
        }
      }
      lastTap = now;
    });
  }

  addLog(entry) {
    this.logs.push(entry);

    while (this.logs.length > this.options.maxLines) {
      this.logs.shift();
    }

    if (this.shouldShowLog(entry)) {
      this.appendLogLine(entry);
      this.updateLineCount();
    }
  }

  shouldShowLog(entry) {
    if (!this.activeFilters.has(entry.type)) return false;

    if (this.searchText) {
      return entry.message.toLowerCase().includes(this.searchText);
    }

    return true;
  }

  appendLogLine(entry) {
    const line = document.createElement('div');
    line.className = `mlog-line ${entry.type}`;

    const time = new Date(entry.timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    let html = `<span class="mlog-time">${time}</span>${this.escapeHtml(entry.message)}`;

    if (entry.stack) {
      html += `<div class="mlog-stack">${this.escapeHtml(entry.stack)}</div>`;
    }

    line.innerHTML = html;
    this.logsEl.appendChild(line);

    while (this.logsEl.children.length > this.options.maxLines) {
      this.logsEl.removeChild(this.logsEl.firstChild);
    }

    this.logsEl.scrollTop = this.logsEl.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  render() {
    this.logsEl.innerHTML = '';

    this.logs.forEach((entry) => {
      if (this.shouldShowLog(entry)) {
        this.appendLogLine(entry);
      }
    });

    this.updateLineCount();
  }

  updateLineCount() {
    const visible = this.logsEl.children.length;
    const total = this.logs.length;
    this.lineCountEl.textContent =
      visible === total ? `${total} lines` : `${visible}/${total} lines`;
  }

  clear() {
    this.logs = [];
    this.logsEl.innerHTML = '';
    this.updateLineCount();
  }

  show() {
    this.element.classList.remove('mlog-minimized');
  }

  hide() {
    this.element.classList.add('mlog-minimized');
  }

  toggle() {
    this.element.classList.toggle('mlog-minimized');
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    removeStyles();
  }

  getLogsText() {
    return this.logs
      .map((entry) => {
        const time = new Date(entry.timestamp).toISOString();
        let text = `[${time}] [${entry.type.toUpperCase()}] ${entry.message}`;
        if (entry.stack) {
          text += `\n${entry.stack}`;
        }
        return text;
      })
      .join('\n');
  }

  getLogsJson() {
    return JSON.stringify(this.logs, null, 2);
  }
}
