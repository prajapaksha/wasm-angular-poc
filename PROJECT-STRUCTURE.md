# Project Structure Guide

## 📁 Current Clean Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── wasm-demo/              # Angular component for the demo UI
│   │       ├── wasm-demo.ts       # Component logic
│   │       ├── wasm-demo.html     # Component template
│   │       └── wasm-demo.css      # Component styles
│   │
│   ├── services/
│   │   └── webassembly.service.ts # ✅ MAIN SERVICE (Angular service)
│   │
│   ├── app.ts                     # Main app component
│   ├── app.html                   # Main app template
│   └── app.css                    # Main app styles
│
└── wasm/                          # WebAssembly source files
    ├── math.c                     # C source code (for reference)
    ├── math.wat                   # WebAssembly text format (for reference)
    └── math.wasm.ts              # Pre-compiled WASM binary (not currently used)
```

## 🎯 Purpose of Each Directory

### `/src/app/services/`
- **Purpose**: Contains Angular services that provide business logic and data management
- **Contains**: `webassembly.service.ts` - The main service that handles WebAssembly module loading and function calls
- **Why here**: Follows Angular conventions for service organization
- **Used by**: Angular components throughout the application

### `/src/wasm/`
- **Purpose**: Contains WebAssembly-related source files and documentation
- **Contains**: 
  - `math.c` - Original C source code (for reference and future compilation)
  - `math.wat` - WebAssembly text format (human-readable WASM)
  - `math.wasm.ts` - Pre-compiled binary (currently not used by the service)
- **Why here**: Keeps WASM-related files organized separately from Angular code
- **Note**: These are primarily for reference and future development

## 🔧 How It Currently Works

1. **Main Service**: `src/app/services/webassembly.service.ts`
   - Contains the actual working WebAssembly implementation
   - Has built-in fallback to JavaScript if WASM fails
   - Creates WASM binary programmatically (minimal add/multiply functions)
   - Used by the Angular component

2. **Source Files in /wasm/**: 
   - Kept for reference and documentation
   - Shows what the C source looks like
   - Shows the WAT (WebAssembly Text) format
   - Contains a pre-compiled binary (though the service creates its own)

## 🚀 For Future Development

If you want to compile actual C code to WebAssembly:

1. **Install Emscripten**:
   ```bash
   # Download and install Emscripten SDK
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ./emsdk install latest
   ./emsdk activate latest
   ```

2. **Compile C to WASM**:
   ```bash
   emcc src/wasm/math.c -o src/app/services/math.js \
     -s EXPORTED_FUNCTIONS="['_add','_multiply','_factorial']" \
     -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" \
     -s WASM=1 -O3
   ```

3. **Update the service** to use the compiled WASM file instead of the programmatically created one.

## 📋 Best Practices

- **Services**: Keep in `src/app/services/` following Angular conventions
- **WASM Sources**: Keep in `src/wasm/` for organization and reference
- **No Duplicates**: Maintain single source of truth for each file type
- **Clear Naming**: Use descriptive names that indicate purpose and location

## 🔍 Previous Issue

The confusion arose because during development, I accidentally created duplicate files:
- ❌ `src/wasm/webassembly.service.ts` (old, broken version)
- ✅ `src/app/services/webassembly.service.ts` (current, working version)

This has now been cleaned up, with only the working version remaining in the correct location.
