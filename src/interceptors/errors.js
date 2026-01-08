export class ErrorInterceptor {
  constructor(onError) {
    this.onError = onError;
    this.installed = false;
    this.boundErrorHandler = this.handleError.bind(this);
    this.boundRejectionHandler = this.handleRejection.bind(this);
  }

  install() {
    if (this.installed) return;

    window.addEventListener('error', this.boundErrorHandler);
    window.addEventListener('unhandledrejection', this.boundRejectionHandler);

    this.installed = true;
  }

  uninstall() {
    if (!this.installed) return;

    window.removeEventListener('error', this.boundErrorHandler);
    window.removeEventListener('unhandledrejection', this.boundRejectionHandler);

    this.installed = false;
  }

  handleError(event) {
    const { message, filename, lineno, colno, error } = event;

    let stack = '';
    if (error && error.stack) {
      stack = this.formatStack(error.stack);
    } else if (filename) {
      stack = `  at ${filename}:${lineno}:${colno}`;
    }

    this.onError({
      type: 'error',
      message: message || 'Unknown error',
      stack,
      timestamp: Date.now(),
    });
  }

  handleRejection(event) {
    const reason = event.reason;
    let message = 'Unhandled Promise Rejection';
    let stack = '';

    if (reason) {
      if (reason instanceof Error) {
        message = reason.message || message;
        stack = reason.stack ? this.formatStack(reason.stack) : '';
      } else if (typeof reason === 'string') {
        message = reason;
      } else {
        try {
          message = JSON.stringify(reason);
        } catch {
          message = String(reason);
        }
      }
    }

    this.onError({
      type: 'error',
      message: `[Promise] ${message}`,
      stack,
      timestamp: Date.now(),
    });
  }

  formatStack(stack) {
    return stack
      .split('\n')
      .slice(1, 5)
      .map((line) => line.trim())
      .join('\n');
  }
}
