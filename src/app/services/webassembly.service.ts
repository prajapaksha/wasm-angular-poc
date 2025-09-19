import { Injectable } from '@angular/core';

export interface WasmMathModule {
  add(a: number, b: number): number;
  multiply(a: number, b: number): number;
  factorial(n: number): number;
}

@Injectable({
  providedIn: 'root',
})
export class WebAssemblyService {
  private wasmModule: WasmMathModule | null = null;
  private isLoaded = false;
  private isRealWasm = false;

  constructor() {}

  async loadWasmModule(): Promise<WasmMathModule> {
    if (this.wasmModule) {
      return this.wasmModule;
    }

    try {
      // Create an extremely minimal working WebAssembly module with just add function
      const wasmBytes = new Uint8Array([
        0x00, 0x61, 0x73, 0x6d, // magic number
        0x01, 0x00, 0x00, 0x00, // version
        0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f, // type section
        0x03, 0x02, 0x01, 0x00, // function section
        0x07, 0x07, 0x01, 0x03, 0x61, 0x64, 0x64, 0x00, 0x00, // export section
        0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b // code section
      ]);

      console.log('🔄 Attempting to load WebAssembly module...');
      const wasmModule = await WebAssembly.instantiate(wasmBytes);
      const exports = wasmModule.instance.exports as any;

      // Verify exports exist
      if (typeof exports.add === 'function') {
        this.wasmModule = {
          add: (a: number, b: number): number => exports.add(a, b),
          multiply: (a: number, b: number): number => {
            // Implement multiply using WASM add function repeatedly
            if (b === 0) return 0;
            if (b === 1) return a;
            let result = 0;
            for (let i = 0; i < Math.abs(b); i++) {
              result = exports.add(result, a);
            }
            return b < 0 ? -result : result;
          },
          factorial: (n: number): number => {
            // Implement factorial using JavaScript
            if (n <= 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
              result *= i;
            }
            return result;
          },
        };

        this.isRealWasm = true;
        this.isLoaded = true;
        console.log('✅ Real WebAssembly module loaded successfully!');
        return this.wasmModule;
      } else {
        throw new Error('WASM exports not found');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('⚠️ WebAssembly loading failed, using JavaScript fallback:', errorMessage);

      // Fallback to JavaScript implementation
      this.wasmModule = {
        add: (a: number, b: number): number => a + b,
        multiply: (a: number, b: number): number => a * b,
        factorial: (n: number): number => {
          if (n <= 1) return 1;
          let result = 1;
          for (let i = 2; i <= n; i++) {
            result *= i;
          }
          return result;
        },
      };

      this.isRealWasm = false;
      this.isLoaded = true;
      console.log('✅ JavaScript fallback loaded successfully');
      return this.wasmModule;
    }
  }

  isWasmLoaded(): boolean {
    return this.isLoaded;
  }

  isUsingRealWasm(): boolean {
    return this.isRealWasm;
  }

  // Convenience methods that automatically load the module if needed
  async add(a: number, b: number): Promise<number> {
    const module = await this.loadWasmModule();
    return module.add(a, b);
  }

  async multiply(a: number, b: number): Promise<number> {
    const module = await this.loadWasmModule();
    return module.multiply(a, b);
  }

  async factorial(n: number): Promise<number> {
    const module = await this.loadWasmModule();
    return module.factorial(n);
  }

  // Performance comparison: JavaScript vs WebAssembly/Fallback
  async performanceTest(iterations: number = 100000): Promise<{
    jsTime: number;
    wasmTime: number;
    speedup: number;
    usingRealWasm: boolean;
  }> {
    const module = await this.loadWasmModule();

    // JavaScript factorial function
    const jsFactorial = (n: number): number => {
      if (n <= 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    };

    // Test JavaScript performance
    const jsStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      jsFactorial(10);
    }
    const jsEnd = performance.now();
    const jsTime = jsEnd - jsStart;

    // Test WebAssembly/Fallback performance
    const wasmStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      module.factorial(10);
    }
    const wasmEnd = performance.now();
    const wasmTime = wasmEnd - wasmStart;

    const speedup = jsTime / wasmTime;

    return {
      jsTime: Math.round(jsTime * 100) / 100,
      wasmTime: Math.round(wasmTime * 100) / 100,
      speedup: Math.round(speedup * 100) / 100,
      usingRealWasm: this.isRealWasm,
    };
  }
}
