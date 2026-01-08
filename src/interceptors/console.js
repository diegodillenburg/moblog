export class ConsoleInterceptor {
  constructor(onLog) {
    this.onLog = onLog;
    this.originals = {};
    this.installed = false;
  }

  install() {
    if (this.installed) return;

    const methods = ['log', 'info', 'warn', 'error', 'debug'];

    methods.forEach((method) => {
      this.originals[method] = console[method];

      console[method] = (...args) => {
        this.originals[method].apply(console, args);

        const message = args
          .map((a) => {
            if (a === null) return 'null';
            if (a === undefined) return 'undefined';
            if (typeof a === 'object') {
              try {
                return JSON.stringify(a, null, 2);
              } catch {
                return String(a);
              }
            }
            return String(a);
          })
          .join(' ');

        this.onLog({
          type: method === 'log' ? 'log' : method,
          message,
          timestamp: Date.now(),
        });
      };
    });

    this.installed = true;
  }

  uninstall() {
    if (!this.installed) return;

    Object.keys(this.originals).forEach((method) => {
      console[method] = this.originals[method];
    });

    this.originals = {};
    this.installed = false;
  }
}
