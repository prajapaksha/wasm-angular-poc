# WebAssembly + Angular POC

This project demonstrates how to integrate WebAssembly (WASM) with Angular to create high-performance web applications.

## 🚀 Features

- **WebAssembly Integration**: Demonstrates loading and executing WASM modules in Angular
- **Mathematical Operations**: Showcases basic math functions (addition, multiplication, factorial) implemented in WASM
- **Performance Comparison**: Compares execution speed between JavaScript and WebAssembly
- **Interactive UI**: Clean, responsive interface for testing WASM functionality
- **Real-time Results**: Live display of calculation results and execution times

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── wasm-demo/          # Main demo component
│   ├── services/
│   │   ├── webassembly.service.ts  # WASM service for module management
│   │   └── math.wasm.ts            # Pre-compiled WASM binary
│   └── wasm/
│       ├── math.c              # Original C source code
│       └── math.wat            # WebAssembly text format
```

## 🛠️ Technologies Used

- **Angular 18+**: Modern Angular with standalone components
- **WebAssembly**: For high-performance calculations
- **TypeScript**: For type-safe development
- **CSS3**: For responsive styling with gradients and animations

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser with WebAssembly support

## 🚀 Getting Started

1. **Clone and navigate to the project:**
   ```bash
   cd wasm-angular-poc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   ng serve
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:4200
   ```

## 🧪 Testing the Demo

The application provides several interactive features:

### Mathematical Operations
- **Addition**: Add two numbers using WASM
- **Multiplication**: Multiply two numbers using WASM  
- **Factorial**: Calculate factorial using WASM (limited to n ≤ 20)

### Performance Testing
- Run performance comparisons between JavaScript and WebAssembly
- View execution times and speed improvements
- Test with 100,000 iterations for meaningful results

### Results Tracking
- View real-time calculation results
- Monitor execution times in milliseconds
- Track operation history with timestamps

## 🔧 How It Works

### 1. WebAssembly Module Loading
The `WebAssemblyService` handles loading the WASM module:

```typescript
async loadWasmModule(): Promise<WasmMathModule> {
  const wasmModule = await WebAssembly.instantiate(wasmBinary);
  const exports = wasmModule.instance.exports as any;
  
  return {
    add: (a: number, b: number) => exports.add(a, b),
    multiply: (a: number, b: number) => exports.multiply(a, b),
    factorial: (n: number) => exports.factorial(n)
  };
}
```

### 2. Function Calls
Each mathematical operation is wrapped in a service method:

```typescript
async add(a: number, b: number): Promise<number> {
  const module = await this.loadWasmModule();
  return module.add(a, b);
}
```

### 3. Performance Comparison
The service includes methods to compare JavaScript vs WebAssembly performance:

```typescript
async performanceTest(iterations: number = 1000000): Promise<{
  jsTime: number;
  wasmTime: number;
  speedup: number;
}> {
  // Implementation details...
}
```

## 📝 WebAssembly Source Code

The WASM module is compiled from C code (`src/wasm/math.c`):

```c
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int add(int a, int b) {
    return a + b;
}

EMSCRIPTEN_KEEPALIVE
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

## 🎯 Key Benefits of WebAssembly

1. **Performance**: Near-native execution speed for compute-intensive tasks
2. **Portability**: Run the same code across different platforms
3. **Security**: Sandboxed execution environment
4. **Language Flexibility**: Write in C, C++, Rust, or other compiled languages

## 🔮 Future Enhancements

- [ ] Add more complex mathematical operations
- [ ] Implement image/video processing examples
- [ ] Add WebAssembly modules compiled from Rust
- [ ] Demonstrate WASM with Web Workers
- [ ] Add memory management examples
- [ ] Implement streaming compilation for large modules

## 📚 Learn More

- [WebAssembly Official Documentation](https://webassembly.org/)
- [Angular WebAssembly Guide](https://angular.io/guide/web-assembly)
- [Emscripten Compiler](https://emscripten.org/)
- [WebAssembly Studio](https://webassembly.studio/)

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
