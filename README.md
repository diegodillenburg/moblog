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

## Framework Integration

Initialize mlog **as early as possible** to capture all console output. The best location depends on your stack:

### Rails (with importmaps or esbuild)

```js
// app/javascript/application.js (top of file)
import Mlog from 'mlog';
Mlog.init();

// ... rest of your imports
```

### Rails (Stimulus)

```js
// app/javascript/controllers/application.js
import { Application } from "@hotwired/stimulus";
import Mlog from 'mlog';

Mlog.init();

const application = Application.start();
```

### React / Next.js

```jsx
// src/index.js or pages/_app.js (top of file)
import Mlog from 'mlog';
Mlog.init();

// ... rest of imports
```

### Vue

```js
// src/main.js (top of file)
import Mlog from 'mlog';
Mlog.init();

import { createApp } from 'vue';
// ...
```

### Vanilla HTML

```html
<!-- In <head>, before other scripts -->
<script src="https://unpkg.com/mlog"></script>
<script>Mlog.init();</script>
```

### Conditional Loading (Production only, dev only, etc.)

```js
// Only in development
if (process.env.NODE_ENV === 'development') {
  import('mlog').then(({ default: Mlog }) => Mlog.init());
}

// Only in production (for field debugging)
if (process.env.NODE_ENV === 'production') {
  import('mlog').then(({ default: Mlog }) => Mlog.init());
}

// Only on mobile devices
if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
  import('mlog').then(({ default: Mlog }) => Mlog.init());
}
```

## Use Cases

- Debug JavaScript issues on mobile devices without DevTools
- Capture errors from users in the field
- Debug PWAs and service workers on mobile
- Quick debugging on devices where connecting DevTools is difficult

## Development

```bash
npm install       # Install dependencies
npm run build     # Build all bundles
npm run dev       # Watch mode
npm test          # Run tests
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
