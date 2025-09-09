# WebAssembly Development Guide

This guide explains how to extend and modify the WebAssembly functionality in this Angular POC.

## 🔧 Adding New WebAssembly Functions

### 1. Update the C Source Code

Edit `src/wasm/math.c` to add new functions:

```c
#include <emscripten.h>

// Add your new function
EMSCRIPTEN_KEEPALIVE
int isPrime(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}
```

### 2. Compile to WebAssembly

If you have Emscripten installed:

```bash
emcc src/wasm/math.c -o src/app/services/math.js \
  -s EXPORTED_FUNCTIONS="['_add','_multiply','_factorial','_isPrime']" \
  -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" \
  -s WASM=1 \
  -O3
```

### 3. Update the WASM Binary

If you don't have Emscripten, you can use online tools:
- [WebAssembly Studio](https://webassembly.studio/)
- [WasmFiddle](https://wasdk.github.io/WasmFiddle/)

Copy the generated `.wasm` file content to `math.wasm.ts` as a Uint8Array.

### 4. Update the Service Interface

Modify `src/app/services/webassembly.service.ts`:

```typescript
export interface WasmMathModule {
  add(a: number, b: number): number;
  multiply(a: number, b: number): number;
  factorial(n: number): number;
  isPrime(n: number): number; // Add new function
}

@Injectable({
  providedIn: 'root'
})
export class WebAssemblyService {
  // ... existing code ...

  // Add wrapper method
  async isPrime(n: number): Promise<boolean> {
    const module = await this.loadWasmModule();
    return module.isPrime(n) === 1;
  }
}
```

## 🎨 Adding New UI Components

### 1. Generate a New Component

```bash
ng generate component components/prime-checker
```

### 2. Import and Use the Service

```typescript
import { Component } from '@angular/core';
import { WebAssemblyService } from '../../services/webassembly.service';

@Component({
  selector: 'app-prime-checker',
  // ... component config
})
export class PrimeCheckerComponent {
  
  constructor(private wasmService: WebAssemblyService) {}
  
  async checkPrime(n: number) {
    const isPrime = await this.wasmService.isPrime(n);
    console.log(`${n} is ${isPrime ? 'prime' : 'not prime'}`);
  }
}
```

## 📊 Performance Optimization Tips

### 1. Minimize Function Call Overhead

For operations called frequently, consider batching:

```typescript
// Instead of multiple individual calls
for (let i = 0; i < 1000; i++) {
  await wasmService.add(i, i + 1);
}

// Batch the operations in WASM
async batchAdd(numbers: number[]): Promise<number[]> {
  // Implement batch processing in WASM
}
```

### 2. Memory Management

For complex data structures, manage memory carefully:

```c
// In your C code
#include <stdlib.h>

EMSCRIPTEN_KEEPALIVE
int* createArray(int size) {
    return malloc(size * sizeof(int));
}

EMSCRIPTEN_KEEPALIVE
void freeArray(int* arr) {
    free(arr);
}
```

### 3. Use Appropriate Data Types

Choose the right data types for your use case:
- `i32` for 32-bit integers
- `i64` for 64-bit integers  
- `f32` for 32-bit floats
- `f64` for 64-bit floats

## 🚀 Advanced WebAssembly Features

### 1. WebAssembly with Web Workers

For CPU-intensive tasks that shouldn't block the UI:

```typescript
// worker.ts
import { WebAssemblyService } from './webassembly.service';

self.onmessage = async function(e) {
  const wasmService = new WebAssemblyService();
  await wasmService.loadWasmModule();
  
  const result = await wasmService.factorial(e.data.n);
  self.postMessage({ result });
};
```

### 2. Streaming Compilation

For large WASM modules:

```typescript
async loadWasmStreaming(url: string) {
  const response = await fetch(url);
  const module = await WebAssembly.compileStreaming(response);
  const instance = await WebAssembly.instantiate(module);
  return instance.exports;
}
```

### 3. WASM with Shared Memory

For multi-threaded applications:

```c
#include <emscripten/threading.h>

EMSCRIPTEN_KEEPALIVE
void parallelComputation(int* data, int size) {
    // Use threading for parallel processing
}
```

## 🔍 Debugging WebAssembly

### 1. Browser DevTools

- Enable WASM debugging in Chrome DevTools
- Set breakpoints in WASM code
- Inspect memory usage

### 2. Console Logging

Add logging to your WASM service:

```typescript
async performOperation(a: number, b: number): Promise<number> {
  console.time('WASM Operation');
  const result = await this.wasmService.add(a, b);
  console.timeEnd('WASM Operation');
  return result;
}
```

### 3. Performance Profiling

Use the Performance tab in DevTools to analyze:
- Function call overhead
- Memory allocation patterns
- Compilation time

## 📝 Testing WebAssembly Code

### 1. Unit Tests

```typescript
// wasm.service.spec.ts
describe('WebAssemblyService', () => {
  let service: WebAssemblyService;

  beforeEach(() => {
    service = new WebAssemblyService();
  });

  it('should perform addition correctly', async () => {
    await service.loadWasmModule();
    const result = await service.add(5, 3);
    expect(result).toBe(8);
  });
});
```

### 2. Performance Tests

```typescript
it('should be faster than JavaScript for complex calculations', async () => {
  const perfResults = await service.performanceTest(10000);
  expect(perfResults.speedup).toBeGreaterThan(1);
});
```

## 🌐 Deployment Considerations

### 1. WASM File Size

Optimize your WASM modules:
- Use `-O3` optimization flag
- Remove unused functions
- Consider compression (gzip/brotli)

### 2. Browser Compatibility

Ensure WebAssembly support:

```typescript
if (typeof WebAssembly === 'object') {
  // WebAssembly is supported
  await this.loadWasmModule();
} else {
  // Fallback to JavaScript implementation
  this.useJavaScriptFallback();
}
```

### 3. MIME Types

Configure your server to serve `.wasm` files with the correct MIME type:

```
application/wasm
```

## 🔗 Useful Resources

- [WebAssembly MDN Documentation](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Emscripten Documentation](https://emscripten.org/docs/)
- [WebAssembly Performance Tips](https://web.dev/webassembly/)
- [WASM Explorer](https://mbebenita.github.io/WasmExplorer/)

## 🤝 Contributing

When adding new features:

1. Update the interface definitions
2. Add comprehensive tests
3. Update documentation
4. Consider performance implications
5. Ensure cross-browser compatibility
