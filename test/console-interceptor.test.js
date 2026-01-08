import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConsoleInterceptor } from '../src/interceptors/console.js';

describe('ConsoleInterceptor', () => {
  let interceptor;
  let logs;
  let originalConsole;

  beforeEach(() => {
    logs = [];
    originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    };

    interceptor = new ConsoleInterceptor((entry) => {
      logs.push(entry);
    });
  });

  afterEach(() => {
    interceptor.uninstall();
    Object.assign(console, originalConsole);
  });

  it('captures console.log calls', () => {
    interceptor.install();
    console.log('test message');

    expect(logs).toHaveLength(1);
    expect(logs[0].type).toBe('log');
    expect(logs[0].message).toBe('test message');
    expect(logs[0].timestamp).toBeDefined();
  });

  it('captures console.warn calls', () => {
    interceptor.install();
    console.warn('warning message');

    expect(logs).toHaveLength(1);
    expect(logs[0].type).toBe('warn');
    expect(logs[0].message).toBe('warning message');
  });

  it('captures console.error calls', () => {
    interceptor.install();
    console.error('error message');

    expect(logs).toHaveLength(1);
    expect(logs[0].type).toBe('error');
    expect(logs[0].message).toBe('error message');
  });

  it('serializes objects to JSON', () => {
    interceptor.install();
    console.log({ foo: 'bar', num: 42 });

    expect(logs[0].message).toContain('"foo"');
    expect(logs[0].message).toContain('"bar"');
  });

  it('joins multiple arguments', () => {
    interceptor.install();
    console.log('hello', 'world', 123);

    expect(logs[0].message).toBe('hello world 123');
  });

  it('still calls original console methods', () => {
    const originalLog = console.log;
    let originalCalled = false;
    let originalArgs = null;

    console.log = (...args) => {
      originalCalled = true;
      originalArgs = args;
    };

    interceptor = new ConsoleInterceptor((entry) => logs.push(entry));
    interceptor.install();
    console.log('test');

    expect(originalCalled).toBe(true);
    expect(originalArgs).toEqual(['test']);

    console.log = originalLog;
  });

  it('uninstall restores original console', () => {
    interceptor.install();
    interceptor.uninstall();
    console.log('after uninstall');

    expect(logs).toHaveLength(0);
  });

  it('handles null and undefined', () => {
    interceptor.install();
    console.log(null, undefined);

    expect(logs[0].message).toBe('null undefined');
  });
});
