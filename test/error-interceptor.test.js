import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ErrorInterceptor } from '../src/interceptors/errors.js';

describe('ErrorInterceptor', () => {
  let interceptor;
  let errors;

  beforeEach(() => {
    errors = [];
    interceptor = new ErrorInterceptor((entry) => {
      errors.push(entry);
    });
  });

  afterEach(() => {
    interceptor.uninstall();
  });

  it('captures window.onerror events', () => {
    interceptor.install();

    const errorEvent = new ErrorEvent('error', {
      message: 'Test error',
      filename: 'test.js',
      lineno: 10,
      colno: 5,
    });
    window.dispatchEvent(errorEvent);

    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('error');
    expect(errors[0].message).toBe('Test error');
    expect(errors[0].timestamp).toBeDefined();
  });

  it('captures unhandled promise rejections', async () => {
    interceptor.install();

    // jsdom doesn't have PromiseRejectionEvent, create a custom event
    const event = new Event('unhandledrejection');
    event.reason = new Error('Promise failed');
    event.promise = Promise.resolve();
    window.dispatchEvent(event);

    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('error');
    expect(errors[0].message).toContain('Promise');
    expect(errors[0].message).toContain('Promise failed');
  });

  it('handles string rejection reasons', () => {
    interceptor.install();

    const event = new Event('unhandledrejection');
    event.reason = 'Simple string error';
    event.promise = Promise.resolve();
    window.dispatchEvent(event);

    expect(errors[0].message).toContain('Simple string error');
  });

  it('extracts stack traces from Error objects', () => {
    interceptor.install();

    const error = new Error('With stack');
    const errorEvent = new ErrorEvent('error', {
      message: 'With stack',
      error: error,
    });
    window.dispatchEvent(errorEvent);

    expect(errors[0].stack).toBeDefined();
  });

  it('uninstall stops capturing errors', () => {
    interceptor.install();
    interceptor.uninstall();

    const errorEvent = new ErrorEvent('error', {
      message: 'Should not capture',
    });
    window.dispatchEvent(errorEvent);

    expect(errors).toHaveLength(0);
  });
});
