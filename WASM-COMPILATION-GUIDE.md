# Real WebAssembly Compilation Guide

## 🔍 Current Status

**Important**: The current project does NOT use real compilation from C to WASM. Here's what we have:

### Files and Their Origins:

| File | How It Was Created | Purpose |
|------|-------------------|---------|
| `src/wasm/math.c` | ✍️ **Manually written** | Reference/example C code |
| `src/wasm/math.wat` | ✍️ **Manually written** | Reference WebAssembly text format |
| `src/wasm/math.wasm.ts` | ✍️ **Manually written** | TypeScript file with binary array |
| **Actual WASM used** | 🔧 **Programmatically created** in `webassembly.service.ts` | Working WASM binary |

## 🛠️ Tools for Real WASM Compilation

### 1. **Emscripten** (Recommended for C/C++)

#### Installation:
```bash
# Clone Emscripten SDK
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk

# Install and activate latest version
./emsdk install latest
./emsdk activate latest

# Add to PATH (add to your shell profile)
source ./emsdk_env.sh
```

#### Compilation:
```bash
# Basic compilation
emcc src/wasm/math.c -o math.js -s WASM=1

# Advanced compilation with exports
emcc src/wasm/math.c -o math.js \
  -s EXPORTED_FUNCTIONS="['_add','_multiply','_factorial']" \
  -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="MathModule" \
  -O3

# This creates:
# - math.js (JavaScript glue code)
# - math.wasm (WebAssembly binary)
```

### 2. **WABT (WebAssembly Binary Toolkit)**

#### Installation:
```bash
# Windows: Download from GitHub releases
# https://github.com/WebAssembly/wabt/releases

# macOS
brew install wabt

# Ubuntu/Debian
sudo apt-get install wabt
```

#### Usage:
```bash
# Convert WAT to WASM
wat2wasm math.wat -o math.wasm

# Convert WASM to WAT
wasm2wat math.wasm -o math.wat

# Validate WASM
wasm-validate math.wasm
```

### 3. **Clang with WASM Target**

```bash
# Direct compilation to WASM
clang --target=wasm32 \
  -nostdlib \
  -Wl,--no-entry \
  -Wl,--export-all \
  -o math.wasm \
  src/wasm/math.c
```

### 4. **Online Tools** (For Quick Testing)

- **WebAssembly Studio**: https://webassembly.studio/
- **WasmFiddle**: https://wasdk.github.io/WasmFiddle/
- **Wasm Explorer**: https://mbebenita.github.io/WasmExplorer/

## 🚀 Step-by-Step: Converting This Project to Use Real WASM

### Step 1: Install Emscripten
```bash
# Windows (PowerShell)
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk.ps1 install latest
./emsdk.ps1 activate latest
```

### Step 2: Compile the C Code
```bash
cd "C:\DCI\Research\Web Assembly\wasm-angular-poc"

# Compile to WASM
emcc src/wasm/math.c -o src/assets/math.js \
  -s EXPORTED_FUNCTIONS="['_add','_multiply','_factorial']" \
  -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="MathModule"
```

### Step 3: Update the Angular Service
```typescript
// In webassembly.service.ts
async loadWasmModule(): Promise<WasmMathModule> {
  try {
    // Import the compiled module
    const MathModule = await import('../../assets/math.js');
    const module = await MathModule.default();
    
    this.wasmModule = {
      add: (a: number, b: number) => module.ccall('add', 'number', ['number', 'number'], [a, b]),
      multiply: (a: number, b: number) => module.ccall('multiply', 'number', ['number', 'number'], [a, b]),
      factorial: (n: number) => module.ccall('factorial', 'number', ['number'], [n])
    };
    
    this.isRealWasm = true;
    return this.wasmModule;
  } catch (error) {
    // Fallback to current implementation
    // ... existing fallback code
  }
}
```

### Step 4: Update Angular Configuration
```json
// In angular.json, add to assets:
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "**/*.wasm",
    "input": "src/assets",
    "output": "/assets/"
  }
]
```

## 🔧 Alternative: Online Compilation

If you don't want to install tools locally:

1. **Go to WebAssembly Studio**: https://webassembly.studio/
2. **Create new project** → "Empty C Project"
3. **Copy the C code** from `src/wasm/math.c`
4. **Click "Build"** to compile
5. **Download the generated .wasm file**
6. **Convert to TypeScript array** using a hex editor or online tool

## 📝 Summary

- **Current project**: Uses hand-crafted WASM binary created in TypeScript
- **Real compilation**: Requires Emscripten, WABT, or online tools
- **Recommendation**: Use Emscripten for production projects
- **Quick testing**: Use online tools like WebAssembly Studio

The files in `/src/wasm/` are currently just **reference examples**, not the actual compiled output from the C code.
