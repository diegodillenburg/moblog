# moblog Roadmap

## v1.0.0 (Current)

- [x] Console capture (log/info/warn/error/debug)
- [x] Error capture (window.onerror + unhandledrejection)
- [x] Floating overlay with FAB minimize button
- [x] Level filter (LOG, INFO, WARN, ERROR, DEBUG)
- [x] Text search with debounce
- [x] Copy logs to clipboard
- [x] Export as TXT/JSON
- [x] sessionStorage persistence
- [x] `?mlog=false` query param to disable
- [x] Gestures: double-tap toggle, Escape to minimize
- [x] Zero dependencies, ~5KB gzipped

---

## v1.1.0

### Network Panel
- [ ] Intercept `fetch()` requests/responses
- [ ] Intercept `XMLHttpRequest`
- [ ] Display: method, URL, status, duration, size
- [ ] Expandable request/response body preview
- [ ] Filter by status (success/error)

### Storage Inspector
- [ ] View localStorage entries
- [ ] View sessionStorage entries
- [ ] View cookies
- [ ] Edit/delete entries
- [ ] Search across all storage types

### UI Improvements
- [ ] Light theme
- [ ] CSS variables for custom theming
- [ ] Configurable FAB position (all 4 corners)
- [ ] Resizable panel height

### Export Enhancements
- [ ] Include timestamp range in filename
- [ ] Export filtered logs only option
- [ ] Share via Web Share API (mobile)

---

## v2.0.0

### Remote Beacon
- [ ] POST logs to configurable server endpoint
- [ ] Batch logs (configurable size and interval)
- [ ] Offline queue with retry on reconnect
- [ ] Optional device/session metadata
- [ ] Sampling rate configuration

### Element Inspector
- [ ] Tap-to-inspect DOM elements
- [ ] Display: tag, classes, dimensions, computed styles
- [ ] Highlight element on page
- [ ] View element hierarchy

### Performance Metrics
- [ ] FPS counter
- [ ] Memory usage (if available)
- [ ] Core Web Vitals (LCP, FID, CLS)
- [ ] Long task detection
- [ ] Resource timing

### Console Input
- [ ] Execute JavaScript from panel
- [ ] Command history
- [ ] Autocomplete for common APIs
- [ ] Access to `window` and DOM

### Advanced Features
- [ ] Log grouping by request ID
- [ ] Relative timestamps ("2s ago")
- [ ] Desktop notifications on error
- [ ] Bookmarkable log lines
- [ ] Multiple log sources (tabs/split view)

---

## Contributing

Contributions welcome! Please open an issue to discuss before submitting PRs for new features.

## License

MIT
