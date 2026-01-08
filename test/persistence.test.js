import { describe, it, expect, beforeEach } from 'vitest';
import { Persistence } from '../src/storage/persistence.js';

describe('Persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('saves logs to sessionStorage by default', () => {
    const persistence = new Persistence({ storageKey: 'test-logs' });
    const logs = [
      { type: 'log', message: 'test', timestamp: Date.now() },
    ];

    persistence.save(logs);

    const stored = sessionStorage.getItem('test-logs');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored)).toHaveLength(1);
  });

  it('loads logs from storage', () => {
    const persistence = new Persistence({ storageKey: 'test-logs' });
    const logs = [
      { type: 'log', message: 'test', timestamp: Date.now() },
    ];
    sessionStorage.setItem('test-logs', JSON.stringify(logs));

    const loaded = persistence.load();

    expect(loaded).toHaveLength(1);
    expect(loaded[0].message).toBe('test');
  });

  it('returns empty array when no stored logs', () => {
    const persistence = new Persistence({ storageKey: 'test-logs' });

    const loaded = persistence.load();

    expect(loaded).toEqual([]);
  });

  it('clears stored logs', () => {
    const persistence = new Persistence({ storageKey: 'test-logs' });
    sessionStorage.setItem('test-logs', '[]');

    persistence.clear();

    expect(sessionStorage.getItem('test-logs')).toBeNull();
  });

  it('respects maxEntries limit', () => {
    const persistence = new Persistence({
      storageKey: 'test-logs',
      maxEntries: 2,
    });
    const logs = [
      { type: 'log', message: 'one', timestamp: 1 },
      { type: 'log', message: 'two', timestamp: 2 },
      { type: 'log', message: 'three', timestamp: 3 },
    ];

    persistence.save(logs);
    const loaded = persistence.load();

    expect(loaded).toHaveLength(2);
    expect(loaded[0].message).toBe('two');
    expect(loaded[1].message).toBe('three');
  });

  it('uses localStorage when configured', () => {
    const persistence = new Persistence({
      storageKey: 'test-logs',
      useLocalStorage: true,
    });
    const logs = [{ type: 'log', message: 'test', timestamp: Date.now() }];

    persistence.save(logs);

    expect(localStorage.getItem('test-logs')).toBeTruthy();
    expect(sessionStorage.getItem('test-logs')).toBeNull();
  });

  it('handles corrupted storage data gracefully', () => {
    const persistence = new Persistence({ storageKey: 'test-logs' });
    sessionStorage.setItem('test-logs', 'not valid json{{{');

    const loaded = persistence.load();

    expect(loaded).toEqual([]);
  });
});
