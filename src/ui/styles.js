export const STYLES = `
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

export function injectStyles() {
  if (document.getElementById('mlog-styles')) return;

  const style = document.createElement('style');
  style.id = 'mlog-styles';
  style.textContent = STYLES;
  document.head.appendChild(style);
}

export function removeStyles() {
  const style = document.getElementById('mlog-styles');
  if (style) style.remove();
}
