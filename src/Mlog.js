import { ConsoleInterceptor } from './interceptors/console.js';
import { ErrorInterceptor } from './interceptors/errors.js';
import { Overlay } from './ui/overlay.js';
import { Persistence } from './storage/persistence.js';

export class Mlog {
  static instance = null;

  static init(options = {}) {
    if (!Mlog.instance) {
      Mlog.instance = new Mlog(options);
    }
    return Mlog.instance;
  }

  static destroy() {
    if (Mlog.instance) {
      Mlog.instance.destroy();
      Mlog.instance = null;
    }
  }

  constructor(options = {}) {
    this.options = {
      maxLines: 200,
      startMinimized: true,
      position: 'bottom-right',
      theme: 'dark',
      captureConsole: true,
      captureErrors: true,
      capturePromiseRejections: true,
      persist: true,
      storageKey: 'mlog-logs',
      filter: {
        levels: ['log', 'info', 'warn', 'error', 'debug'],
        text: null,
      },
      onLog: null,
      onError: null,
      ...options,
    };

    this.logs = [];
    this.consoleInterceptor = null;
    this.errorInterceptor = null;
    this.overlay = null;
    this.persistence = null;

    this.init();
  }

  init() {
    // Setup persistence
    if (this.options.persist) {
      this.persistence = new Persistence({
        storageKey: this.options.storageKey,
        maxEntries: this.options.maxLines,
      });
      this.logs = this.persistence.load();
    }

    // Setup overlay
    this.overlay = new Overlay({
      maxLines: this.options.maxLines,
      startMinimized: this.options.startMinimized,
      position: this.options.position,
      onCopy: () => this.copy(),
      onClear: () => this.clear(),
      onExport: () => this.export('txt'),
      onFilterChange: (filter) => {
        this.options.filter = filter;
      },
    });
    this.overlay.create();

    // Restore persisted logs to overlay
    this.logs.forEach((entry) => {
      this.overlay.addLog(entry);
    });

    // Setup console interceptor
    if (this.options.captureConsole) {
      this.consoleInterceptor = new ConsoleInterceptor((entry) => {
        this.addEntry(entry);
      });
      this.consoleInterceptor.install();
    }

    // Setup error interceptor
    if (this.options.captureErrors || this.options.capturePromiseRejections) {
      this.errorInterceptor = new ErrorInterceptor((entry) => {
        this.addEntry(entry);
        this.options.onError?.(entry);
      });
      this.errorInterceptor.install();
    }
  }

  addEntry(entry) {
    this.logs.push(entry);

    while (this.logs.length > this.options.maxLines) {
      this.logs.shift();
    }

    this.overlay.addLog(entry);
    this.options.onLog?.(entry);

    if (this.persistence) {
      this.persistence.save(this.logs);
    }
  }

  log(message, type = 'log') {
    this.addEntry({
      type,
      message: String(message),
      timestamp: Date.now(),
    });
  }

  show() {
    this.overlay?.show();
  }

  hide() {
    this.overlay?.hide();
  }

  toggle() {
    this.overlay?.toggle();
  }

  clear() {
    this.logs = [];
    this.overlay?.clear();
    this.persistence?.clear();
  }

  filter(options) {
    if (options.levels) {
      this.options.filter.levels = options.levels;
    }
    if (options.text !== undefined) {
      this.options.filter.text = options.text;
    }
    this.overlay?.render();
  }

  copy() {
    const text = this.overlay?.getLogsText() || '';
    navigator.clipboard.writeText(text).then(
      () => this.log('Logs copied to clipboard', 'info'),
      (err) => this.log(`Failed to copy: ${err.message}`, 'error')
    );
  }

  export(format = 'txt') {
    let content, filename, mimeType;

    if (format === 'json') {
      content = this.overlay?.getLogsJson() || '[]';
      filename = `mlog-${Date.now()}.json`;
      mimeType = 'application/json';
    } else {
      content = this.overlay?.getLogsText() || '';
      filename = `mlog-${Date.now()}.txt`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    this.log(`Exported as ${filename}`, 'info');
  }

  destroy() {
    this.consoleInterceptor?.uninstall();
    this.errorInterceptor?.uninstall();
    this.overlay?.destroy();

    this.consoleInterceptor = null;
    this.errorInterceptor = null;
    this.overlay = null;
    this.persistence = null;
    this.logs = [];
  }
}
