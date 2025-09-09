// Example usage of the WebAssembly service
// This file demonstrates how to use the WASM service in your own components

import { WebAssemblyService } from './app/services/webassembly.service';

// Example function showing how to use the service
async function demonstrateWasmUsage() {
  const wasmService = new WebAssemblyService();
  
  try {
    // Load the WebAssembly module
    console.log('Loading WebAssembly module...');
    await wasmService.loadWasmModule();
    console.log('✅ WebAssembly module loaded successfully!');
    
    // Perform basic operations
    console.log('\n🧮 Performing calculations:');
    
    // Addition
    const sum = await wasmService.add(15, 27);
    console.log(`15 + 27 = ${sum}`);
    
    // Multiplication  
    const product = await wasmService.multiply(8, 9);
    console.log(`8 × 9 = ${product}`);
    
    // Factorial
    const factorial = await wasmService.factorial(6);
    console.log(`6! = ${factorial}`);
    
    // Performance test
    console.log('\n⚡ Running performance test...');
    const perfResults = await wasmService.performanceTest(50000);
    console.log(`JavaScript time: ${perfResults.jsTime}ms`);
    console.log(`WebAssembly time: ${perfResults.wasmTime}ms`);
    console.log(`Speed improvement: ${perfResults.speedup}x`);
    
  } catch (error) {
    console.error('❌ Error loading WebAssembly:', error);
  }
}

// Usage in your Angular component:
/*
import { Component, OnInit } from '@angular/core';
import { WebAssemblyService } from './services/webassembly.service';

@Component({
  selector: 'app-my-component',
  // ... component configuration
})
export class MyComponent implements OnInit {
  
  constructor(private wasmService: WebAssemblyService) {}
  
  async ngOnInit() {
    // Load WASM module on component initialization
    await this.wasmService.loadWasmModule();
  }
  
  async calculateSomething() {
    // Use WASM functions in your methods
    const result = await this.wasmService.add(10, 20);
    console.log('Result:', result);
  }
}
*/

// Run the demonstration (uncomment to use)
// demonstrateWasmUsage();
