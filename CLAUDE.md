# mlog Development Guidelines

## Architecture
```
Mlog (main)
  ├── ConsoleInterceptor - wraps console.* methods
  ├── ErrorInterceptor - window.onerror + unhandledrejection
  ├── Overlay - UI rendering and DOM management
  └── Persistence - sessionStorage wrapper
```

## Constraints
- Zero runtime dependencies
- Bundle size < 10KB gzipped
- ES2018+ target (no IE11)
- All CSS injected via JS

## Adding Features
1. Create module in appropriate directory (interceptors/, ui/, storage/)
2. Export class with install/uninstall or create/destroy lifecycle
3. Wire up in Mlog.js constructor and destroy()
4. Update TypeScript declarations in dist/mlog.d.ts

## Style Guidelines
- CSS variables for theming (--mlog-* prefix)
- Touch targets minimum 44px
- Mobile-first responsive design
- Monospace font for log output

## Build
Uses esbuild. Outputs:
- `dist/mlog.esm.js` - ES modules
- `dist/mlog.umd.js` - Browser global (window.Mlog)
- `dist/mlog.min.js` - Minified for production
