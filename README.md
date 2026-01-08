# mlog

Lightweight mobile browser debug console. ~8KB gzipped.

![Demo](https://via.placeholder.com/600x300?text=mlog+demo)

## Features

- Captures all `console.log/info/warn/error/debug` calls
- Captures uncaught errors and unhandled promise rejections
- Floating overlay with FAB minimize button
- Filter logs by level (LOG, INFO, WARN, ERROR, DEBUG)
- Search/filter logs by text
- Copy logs to clipboard
- Export logs as TXT or JSON
- Persists logs across page refreshes (sessionStorage)
- Zero dependencies
- Mobile-friendly touch targets

## Installation

```bash
npm install mlog
```

Or via CDN:

```html
<script src="https://unpkg.com/mlog"></script>
```

## Quick Start

```js
import Mlog from 'mlog';

// Initialize with defaults
Mlog.init();

// Now all console.log calls will appear in the floating panel
console.log('Hello mlog!');
```

Or with a script tag:

```html
<script src="https://unpkg.com/mlog"></script>
<script>
  Mlog.init();
</script>
```

## Configuration

```js
import Mlog from 'mlog';

const mlog = new Mlog({
  // Display options
  maxLines: 200,              // Max log lines to keep
  startMinimized: true,       // Start as FAB button
  position: 'bottom-right',   // FAB position (future)
  theme: 'dark',              // Theme (future)

  // Capture options
  captureConsole: true,       // Capture console.log/warn/error
  captureErrors: true,        // Capture window.onerror
  capturePromiseRejections: true,  // Capture unhandledrejection

  // Persistence
  persist: true,              // Save logs to sessionStorage
  storageKey: 'mlog-logs',    // Storage key

  // Callbacks
  onLog: (entry) => {},       // Called on each log
  onError: (error) => {},     // Called on errors
});
```

## API

```js
// Static initialization (singleton)
const mlog = Mlog.init(options);

// Or create instance directly
const mlog = new Mlog(options);

// Add custom log
mlog.log('Custom message', 'info');

// Control visibility
mlog.show();
mlog.hide();
mlog.toggle();

// Clear all logs
mlog.clear();

// Copy logs to clipboard
mlog.copy();

// Export logs
mlog.export('txt');   // Download as .txt
mlog.export('json');  // Download as .json

// Cleanup
mlog.destroy();
Mlog.destroy();  // Static method for singleton
```

## Disable via Query Param

Add `?mlog=false` to the URL to completely disable mlog:

```
https://myapp.com/page?mlog=false
```

When disabled, `Mlog.init()` returns a no-op instance so your code won't break.

## Gestures & Shortcuts

- **Double-tap** anywhere on the page to toggle the panel
- **Escape** key to minimize
- **Click** the FAB button to expand

## Use Cases

- Debug JavaScript issues on mobile devices without DevTools
- Capture errors from users in the field
- Debug PWAs and service workers on mobile
- Quick debugging on devices where connecting DevTools is difficult

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## Comparison

| Library | Size | Features |
|---------|------|----------|
| vConsole | 50KB | Full devtools |
| Eruda | 100KB+ | Full devtools |
| debug | 3KB | Logging only, no UI |
| **mlog** | ~8KB | Console + Errors + UI |

## License

MIT
