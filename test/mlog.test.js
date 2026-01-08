import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Mlog } from '../src/Mlog.js';

describe('Mlog', () => {
  beforeEach(() => {
    Mlog.instance = null;
    Mlog.disabled = false;
    document.body.innerHTML = '';
  });

  afterEach(() => {
    Mlog.destroy();
    document.body.innerHTML = '';
  });

  describe('init', () => {
    it('creates singleton instance', () => {
      const mlog1 = Mlog.init();
      const mlog2 = Mlog.init();

      expect(mlog1).toBe(mlog2);
    });

    it('creates overlay element in DOM', () => {
      Mlog.init();

      const overlay = document.getElementById('mlog-overlay');
      expect(overlay).toBeTruthy();
    });

    it('starts minimized by default', () => {
      Mlog.init();

      const overlay = document.getElementById('mlog-overlay');
      expect(overlay.classList.contains('mlog-minimized')).toBe(true);
    });

    it('respects startMinimized: false option', () => {
      Mlog.init({ startMinimized: false });

      const overlay = document.getElementById('mlog-overlay');
      expect(overlay.classList.contains('mlog-minimized')).toBe(false);
    });
  });

  describe('query param disable', () => {
    it('returns noop instance when ?mlog=false', () => {
      const originalLocation = window.location;
      delete window.location;
      window.location = { search: '?mlog=false' };

      const mlog = Mlog.init();

      expect(Mlog.disabled).toBe(true);
      expect(typeof mlog.log).toBe('function');
      expect(typeof mlog.show).toBe('function');
      expect(document.getElementById('mlog-overlay')).toBeNull();

      window.location = originalLocation;
    });

    it('noop instance methods do nothing', () => {
      const originalLocation = window.location;
      delete window.location;
      window.location = { search: '?mlog=false' };

      const mlog = Mlog.init();

      expect(() => {
        mlog.log('test');
        mlog.show();
        mlog.hide();
        mlog.toggle();
        mlog.clear();
        mlog.copy();
        mlog.destroy();
      }).not.toThrow();

      window.location = originalLocation;
    });

    it('initializes normally without query param', () => {
      const originalLocation = window.location;
      delete window.location;
      window.location = { search: '' };

      const mlog = Mlog.init();

      expect(Mlog.disabled).toBe(false);
      expect(document.getElementById('mlog-overlay')).toBeTruthy();

      window.location = originalLocation;
    });
  });

  describe('destroy', () => {
    it('removes overlay from DOM', () => {
      Mlog.init();
      Mlog.destroy();

      expect(document.getElementById('mlog-overlay')).toBeNull();
    });

    it('resets singleton instance', () => {
      Mlog.init();
      Mlog.destroy();

      expect(Mlog.instance).toBeNull();
    });
  });

  describe('visibility controls', () => {
    it('show() expands overlay', () => {
      const mlog = Mlog.init();
      mlog.show();

      const overlay = document.getElementById('mlog-overlay');
      expect(overlay.classList.contains('mlog-minimized')).toBe(false);
    });

    it('hide() minimizes overlay', () => {
      const mlog = Mlog.init({ startMinimized: false });
      mlog.hide();

      const overlay = document.getElementById('mlog-overlay');
      expect(overlay.classList.contains('mlog-minimized')).toBe(true);
    });

    it('toggle() switches visibility', () => {
      const mlog = Mlog.init();
      const overlay = document.getElementById('mlog-overlay');

      mlog.toggle();
      expect(overlay.classList.contains('mlog-minimized')).toBe(false);

      mlog.toggle();
      expect(overlay.classList.contains('mlog-minimized')).toBe(true);
    });
  });

  describe('logging', () => {
    it('log() adds entry to overlay', () => {
      const mlog = Mlog.init({ captureConsole: false });
      mlog.log('test message', 'info');

      const logs = document.querySelector('.mlog-logs');
      expect(logs.textContent).toContain('test message');
    });

    it('clear() removes all logs', () => {
      const mlog = Mlog.init({ captureConsole: false });
      mlog.log('message 1');
      mlog.log('message 2');
      mlog.clear();

      const logs = document.querySelector('.mlog-logs');
      expect(logs.children.length).toBe(0);
    });
  });
});
