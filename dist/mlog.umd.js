var _MlogModule = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // src/index.js
  var src_exports = {};
  __export(src_exports, {
    Mlog: () => Mlog,
    default: () => src_default
  });

  // src/interceptors/console.js
  var ConsoleInterceptor = class {
    constructor(onLog) {
      this.onLog = onLog;
      this.originals = {};
      this.installed = false;
    }
    install() {
      if (this.installed)
        return;
      const methods = ["log", "info", "warn", "error", "debug"];
      methods.forEach((method) => {
        this.originals[method] = console[method];
        console[method] = (...args) => {
          this.originals[method].apply(console, args);
          const message = args.map((a) => {
            if (a === null)
              return "null";
            if (a === void 0)
              return "undefined";
            if (typeof a === "object") {
              try {
                return JSON.stringify(a, null, 2);
              } catch (e) {
                return String(a);
              }
            }
            return String(a);
          }).join(" ");
          this.onLog({
            type: method === "log" ? "log" : method,
            message,
            timestamp: Date.now()
          });
        };
      });
      this.installed = true;
    }
    uninstall() {
      if (!this.installed)
        return;
      Object.keys(this.originals).forEach((method) => {
        console[method] = this.originals[method];
      });
      this.originals = {};
      this.installed = false;
    }
  };

  // src/interceptors/errors.js
  var ErrorInterceptor = class {
    constructor(onError) {
      this.onError = onError;
      this.installed = false;
      this.boundErrorHandler = this.handleError.bind(this);
      this.boundRejectionHandler = this.handleRejection.bind(this);
    }
    install() {
      if (this.installed)
        return;
      window.addEventListener("error", this.boundErrorHandler);
      window.addEventListener("unhandledrejection", this.boundRejectionHandler);
      this.installed = true;
    }
    uninstall() {
      if (!this.installed)
        return;
      window.removeEventListener("error", this.boundErrorHandler);
      window.removeEventListener("unhandledrejection", this.boundRejectionHandler);
      this.installed = false;
    }
    handleError(event) {
      const { message, filename, lineno, colno, error } = event;
      let stack = "";
      if (error && error.stack) {
        stack = this.formatStack(error.stack);
      } else if (filename) {
        stack = `  at ${filename}:${lineno}:${colno}`;
      }
      this.onError({
        type: "error",
        message: message || "Unknown error",
        stack,
        timestamp: Date.now()
      });
    }
    handleRejection(event) {
      const reason = event.reason;
      let message = "Unhandled Promise Rejection";
      let stack = "";
      if (reason) {
        if (reason instanceof Error) {
          message = reason.message || message;
          stack = reason.stack ? this.formatStack(reason.stack) : "";
        } else if (typeof reason === "string") {
          message = reason;
        } else {
          try {
            message = JSON.stringify(reason);
          } catch (e) {
            message = String(reason);
          }
        }
      }
      this.onError({
        type: "error",
        message: `[Promise] ${message}`,
        stack,
        timestamp: Date.now()
      });
    }
    formatStack(stack) {
      return stack.split("\n").slice(1, 5).map((line) => line.trim()).join("\n");
    }
  };

  // src/ui/styles.js
  var STYLES = `
  #mlog-overlay {
    --mlog-bg: rgba(0, 0, 0, 0.92);
    --mlog-border: #333;
    --mlog-text: #e0e0e0;
    --mlog-log: #b8b8b8;
    --mlog-info: #58a6ff;
    --mlog-warn: #d29922;
    --mlog-error: #f85149;
    --mlog-debug: #8b949e;
    --mlog-fab-bg: rgba(30, 30, 30, 0.95);
    --mlog-fab-border: #58a6ff;
    --mlog-btn-bg: #21262d;
    --mlog-btn-hover: #30363d;
    --mlog-input-bg: #161b22;

    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 50vh;
    background: var(--mlog-bg);
    color: var(--mlog-text);
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    font-size: 12px;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--mlog-border);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
    transition: all 0.25s ease;
  }

  #mlog-overlay.mlog-minimized {
    bottom: auto;
    top: 50%;
    left: auto;
    right: 16px;
    transform: translateY(-50%);
    width: 52px;
    height: 52px;
    max-height: 52px;
    border-radius: 50%;
    background: var(--mlog-fab-bg);
    border: 2px solid var(--mlog-fab-border);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  #mlog-overlay.mlog-minimized .mlog-header,
  #mlog-overlay.mlog-minimized .mlog-filters,
  #mlog-overlay.mlog-minimized .mlog-logs {
    display: none;
  }

  #mlog-overlay.mlog-minimized .mlog-fab-icon {
    display: block;
  }

  .mlog-fab-icon {
    display: none;
    font-size: 22px;
    color: var(--mlog-fab-border);
  }

  .mlog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.4);
    border-bottom: 1px solid var(--mlog-border);
    flex-shrink: 0;
    gap: 8px;
  }

  .mlog-title {
    font-weight: 600;
    font-size: 13px;
    color: var(--mlog-fab-border);
  }

  .mlog-controls {
    display: flex;
    gap: 6px;
  }

  .mlog-btn {
    background: var(--mlog-btn-bg);
    color: var(--mlog-text);
    border: 1px solid var(--mlog-border);
    padding: 6px 10px;
    cursor: pointer;
    font-family: inherit;
    font-size: 11px;
    border-radius: 4px;
    min-width: 36px;
    min-height: 32px;
    transition: background 0.15s;
  }

  .mlog-btn:hover {
    background: var(--mlog-btn-hover);
  }

  .mlog-btn:active {
    background: var(--mlog-fab-border);
    color: #000;
  }

  .mlog-filters {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid var(--mlog-border);
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .mlog-filter-btn {
    background: transparent;
    color: var(--mlog-text);
    border: 1px solid var(--mlog-border);
    padding: 4px 8px;
    cursor: pointer;
    font-family: inherit;
    font-size: 10px;
    border-radius: 3px;
    opacity: 0.5;
    transition: all 0.15s;
  }

  .mlog-filter-btn.active {
    opacity: 1;
    border-color: currentColor;
  }

  .mlog-filter-btn[data-level="log"] { color: var(--mlog-log); }
  .mlog-filter-btn[data-level="info"] { color: var(--mlog-info); }
  .mlog-filter-btn[data-level="warn"] { color: var(--mlog-warn); }
  .mlog-filter-btn[data-level="error"] { color: var(--mlog-error); }
  .mlog-filter-btn[data-level="debug"] { color: var(--mlog-debug); }

  .mlog-search {
    flex: 1;
    min-width: 100px;
    max-width: 200px;
    background: var(--mlog-input-bg);
    border: 1px solid var(--mlog-border);
    color: var(--mlog-text);
    padding: 4px 8px;
    font-family: inherit;
    font-size: 11px;
    border-radius: 3px;
  }

  .mlog-search::placeholder {
    color: #666;
  }

  .mlog-search:focus {
    outline: none;
    border-color: var(--mlog-fab-border);
  }

  .mlog-logs {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
    overscroll-behavior: contain;
  }

  .mlog-line {
    padding: 4px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    word-break: break-word;
    line-height: 1.4;
  }

  .mlog-line:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .mlog-line.log { color: var(--mlog-log); }
  .mlog-line.info { color: var(--mlog-info); }
  .mlog-line.warn { color: var(--mlog-warn); }
  .mlog-line.error { color: var(--mlog-error); }
  .mlog-line.debug { color: var(--mlog-debug); }

  .mlog-time {
    color: #666;
    margin-right: 8px;
    font-size: 10px;
  }

  .mlog-stack {
    margin-top: 4px;
    padding-left: 16px;
    font-size: 10px;
    color: #888;
    white-space: pre-wrap;
  }

  .mlog-line-count {
    font-size: 10px;
    color: #666;
  }

  @media (max-width: 480px) {
    #mlog-overlay {
      max-height: 60vh;
    }

    .mlog-header {
      flex-wrap: wrap;
    }

    .mlog-filters {
      padding: 8px;
    }

    .mlog-search {
      width: 100%;
      max-width: none;
      order: -1;
    }
  }
`;
  function injectStyles() {
    if (document.getElementById("mlog-styles"))
      return;
    const style = document.createElement("style");
    style.id = "mlog-styles";
    style.textContent = STYLES;
    document.head.appendChild(style);
  }
  function removeStyles() {
    const style = document.getElementById("mlog-styles");
    if (style)
      style.remove();
  }

  // src/ui/overlay.js
  var Overlay = class {
    constructor(options = {}) {
      this.options = {
        maxLines: 200,
        startMinimized: true,
        position: "bottom-right",
        onCopy: null,
        onClear: null,
        onExport: null,
        onFilterChange: null,
        onSearchChange: null,
        ...options
      };
      this.logs = [];
      this.element = null;
      this.logsEl = null;
      this.searchEl = null;
      this.lineCountEl = null;
      this.activeFilters = /* @__PURE__ */ new Set(["log", "info", "warn", "error", "debug"]);
      this.searchText = "";
    }
    create() {
      injectStyles();
      this.element = document.createElement("div");
      this.element.id = "mlog-overlay";
      if (this.options.startMinimized) {
        this.element.classList.add("mlog-minimized");
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
      this.logsEl = this.element.querySelector(".mlog-logs");
      this.searchEl = this.element.querySelector(".mlog-search");
      this.lineCountEl = this.element.querySelector(".mlog-line-count");
      this.bindEvents();
    }
    bindEvents() {
      this.element.addEventListener("click", (e) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.element.classList.contains("mlog-minimized")) {
          this.show();
          return;
        }
        const btn = e.target.closest(".mlog-btn");
        if (btn) {
          const action = btn.dataset.action;
          if (action === "copy")
            (_b = (_a = this.options).onCopy) == null ? void 0 : _b.call(_a);
          if (action === "export")
            (_d = (_c = this.options).onExport) == null ? void 0 : _d.call(_c);
          if (action === "clear")
            (_f = (_e = this.options).onClear) == null ? void 0 : _f.call(_e);
          if (action === "minimize")
            this.hide();
        }
        const filterBtn = e.target.closest(".mlog-filter-btn");
        if (filterBtn) {
          const level = filterBtn.dataset.level;
          filterBtn.classList.toggle("active");
          if (filterBtn.classList.contains("active")) {
            this.activeFilters.add(level);
          } else {
            this.activeFilters.delete(level);
          }
          (_h = (_g = this.options).onFilterChange) == null ? void 0 : _h.call(_g, {
            levels: Array.from(this.activeFilters),
            text: this.searchText
          });
          this.render();
        }
      });
      let searchTimeout;
      this.searchEl.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          var _a, _b;
          this.searchText = e.target.value.toLowerCase();
          (_b = (_a = this.options).onSearchChange) == null ? void 0 : _b.call(_a, this.searchText);
          this.render();
        }, 150);
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !this.element.classList.contains("mlog-minimized")) {
          this.hide();
        }
      });
      let lastTap = 0;
      document.addEventListener("touchend", (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
          if (!e.target.closest("#mlog-overlay")) {
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
      if (!this.activeFilters.has(entry.type))
        return false;
      if (this.searchText) {
        return entry.message.toLowerCase().includes(this.searchText);
      }
      return true;
    }
    appendLogLine(entry) {
      const line = document.createElement("div");
      line.className = `mlog-line ${entry.type}`;
      const time = new Date(entry.timestamp).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
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
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
    render() {
      this.logsEl.innerHTML = "";
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
      this.lineCountEl.textContent = visible === total ? `${total} lines` : `${visible}/${total} lines`;
    }
    clear() {
      this.logs = [];
      this.logsEl.innerHTML = "";
      this.updateLineCount();
    }
    show() {
      this.element.classList.remove("mlog-minimized");
    }
    hide() {
      this.element.classList.add("mlog-minimized");
    }
    toggle() {
      this.element.classList.toggle("mlog-minimized");
    }
    destroy() {
      if (this.element) {
        this.element.remove();
        this.element = null;
      }
      removeStyles();
    }
    getLogsText() {
      return this.logs.map((entry) => {
        const time = new Date(entry.timestamp).toISOString();
        let text = `[${time}] [${entry.type.toUpperCase()}] ${entry.message}`;
        if (entry.stack) {
          text += `
${entry.stack}`;
        }
        return text;
      }).join("\n");
    }
    getLogsJson() {
      return JSON.stringify(this.logs, null, 2);
    }
  };

  // src/storage/persistence.js
  var Persistence = class {
    constructor(options = {}) {
      this.options = {
        storageKey: "mlog-logs",
        maxEntries: 200,
        useLocalStorage: false,
        ...options
      };
      this.storage = this.options.useLocalStorage ? localStorage : sessionStorage;
    }
    save(logs) {
      try {
        const data = logs.slice(-this.options.maxEntries);
        this.storage.setItem(this.options.storageKey, JSON.stringify(data));
      } catch (e) {
      }
    }
    load() {
      try {
        const stored = this.storage.getItem(this.options.storageKey);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
      }
      return [];
    }
    clear() {
      try {
        this.storage.removeItem(this.options.storageKey);
      } catch (e) {
      }
    }
  };

  // src/Mlog.js
  var _Mlog = class _Mlog {
    static isDisabledByQueryParam() {
      if (typeof window === "undefined")
        return false;
      const params = new URLSearchParams(window.location.search);
      return params.get("mlog") === "false";
    }
    static init(options = {}) {
      if (_Mlog.isDisabledByQueryParam()) {
        _Mlog.disabled = true;
        return _Mlog.createNoopInstance();
      }
      if (!_Mlog.instance) {
        _Mlog.instance = new _Mlog(options);
      }
      return _Mlog.instance;
    }
    static createNoopInstance() {
      return {
        log: () => {
        },
        show: () => {
        },
        hide: () => {
        },
        toggle: () => {
        },
        clear: () => {
        },
        filter: () => {
        },
        copy: () => {
        },
        export: () => {
        },
        destroy: () => {
        }
      };
    }
    static destroy() {
      if (_Mlog.instance) {
        _Mlog.instance.destroy();
        _Mlog.instance = null;
      }
    }
    constructor(options = {}) {
      this.options = {
        maxLines: 200,
        startMinimized: true,
        position: "bottom-right",
        theme: "dark",
        captureConsole: true,
        captureErrors: true,
        capturePromiseRejections: true,
        persist: true,
        storageKey: "mlog-logs",
        filter: {
          levels: ["log", "info", "warn", "error", "debug"],
          text: null
        },
        onLog: null,
        onError: null,
        ...options
      };
      this.logs = [];
      this.consoleInterceptor = null;
      this.errorInterceptor = null;
      this.overlay = null;
      this.persistence = null;
      this.init();
    }
    init() {
      if (this.options.persist) {
        this.persistence = new Persistence({
          storageKey: this.options.storageKey,
          maxEntries: this.options.maxLines
        });
        this.logs = this.persistence.load();
      }
      this.overlay = new Overlay({
        maxLines: this.options.maxLines,
        startMinimized: this.options.startMinimized,
        position: this.options.position,
        onCopy: () => this.copy(),
        onClear: () => this.clear(),
        onExport: () => this.export("txt"),
        onFilterChange: (filter) => {
          this.options.filter = filter;
        }
      });
      this.overlay.create();
      this.logs.forEach((entry) => {
        this.overlay.addLog(entry);
      });
      if (this.options.captureConsole) {
        this.consoleInterceptor = new ConsoleInterceptor((entry) => {
          this.addEntry(entry);
        });
        this.consoleInterceptor.install();
      }
      if (this.options.captureErrors || this.options.capturePromiseRejections) {
        this.errorInterceptor = new ErrorInterceptor((entry) => {
          var _a, _b;
          this.addEntry(entry);
          (_b = (_a = this.options).onError) == null ? void 0 : _b.call(_a, entry);
        });
        this.errorInterceptor.install();
      }
    }
    addEntry(entry) {
      var _a, _b;
      this.logs.push(entry);
      while (this.logs.length > this.options.maxLines) {
        this.logs.shift();
      }
      this.overlay.addLog(entry);
      (_b = (_a = this.options).onLog) == null ? void 0 : _b.call(_a, entry);
      if (this.persistence) {
        this.persistence.save(this.logs);
      }
    }
    log(message, type = "log") {
      this.addEntry({
        type,
        message: String(message),
        timestamp: Date.now()
      });
    }
    show() {
      var _a;
      (_a = this.overlay) == null ? void 0 : _a.show();
    }
    hide() {
      var _a;
      (_a = this.overlay) == null ? void 0 : _a.hide();
    }
    toggle() {
      var _a;
      (_a = this.overlay) == null ? void 0 : _a.toggle();
    }
    clear() {
      var _a, _b;
      this.logs = [];
      (_a = this.overlay) == null ? void 0 : _a.clear();
      (_b = this.persistence) == null ? void 0 : _b.clear();
    }
    filter(options) {
      var _a;
      if (options.levels) {
        this.options.filter.levels = options.levels;
      }
      if (options.text !== void 0) {
        this.options.filter.text = options.text;
      }
      (_a = this.overlay) == null ? void 0 : _a.render();
    }
    copy() {
      var _a;
      const text = ((_a = this.overlay) == null ? void 0 : _a.getLogsText()) || "";
      navigator.clipboard.writeText(text).then(
        () => this.log("Logs copied to clipboard", "info"),
        (err) => this.log(`Failed to copy: ${err.message}`, "error")
      );
    }
    export(format = "txt") {
      var _a, _b;
      let content, filename, mimeType;
      if (format === "json") {
        content = ((_a = this.overlay) == null ? void 0 : _a.getLogsJson()) || "[]";
        filename = `mlog-${Date.now()}.json`;
        mimeType = "application/json";
      } else {
        content = ((_b = this.overlay) == null ? void 0 : _b.getLogsText()) || "";
        filename = `mlog-${Date.now()}.txt`;
        mimeType = "text/plain";
      }
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      this.log(`Exported as ${filename}`, "info");
    }
    destroy() {
      var _a, _b, _c;
      (_a = this.consoleInterceptor) == null ? void 0 : _a.uninstall();
      (_b = this.errorInterceptor) == null ? void 0 : _b.uninstall();
      (_c = this.overlay) == null ? void 0 : _c.destroy();
      this.consoleInterceptor = null;
      this.errorInterceptor = null;
      this.overlay = null;
      this.persistence = null;
      this.logs = [];
    }
  };
  __publicField(_Mlog, "instance", null);
  __publicField(_Mlog, "disabled", false);
  var Mlog = _Mlog;

  // src/index.js
  var src_default = Mlog;
  return __toCommonJS(src_exports);
})();
var Mlog=_MlogModule.default||_MlogModule.Mlog;if(typeof module!=="undefined")module.exports=Mlog;
//# sourceMappingURL=mlog.umd.js.map
