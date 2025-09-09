import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebAssemblyService } from '../../services/webassembly.service';

interface CalculationResult {
  operation: string;
  input: string;
  result: number;
  executionTime: number;
  timestamp: Date;
}

@Component({
  selector: 'app-wasm-demo',
  imports: [CommonModule, FormsModule],
  templateUrl: './wasm-demo.html',
  styleUrl: './wasm-demo.css'
})
export class WasmDemo implements OnInit {
  // Input values
  addA: number = 5;
  addB: number = 3;
  multiplyA: number = 7;
  multiplyB: number = 4;
  factorialN: number = 8;

  // Results
  results: CalculationResult[] = [];
  isWasmLoaded: boolean = false;
  loadingWasm: boolean = false;
  
  // Performance test results
  performanceResults: any = null;
  runningPerformanceTest: boolean = false;

  constructor(public wasmService: WebAssemblyService) {}

  async ngOnInit() {
    await this.loadWasm();
  }

  async loadWasm() {
    this.loadingWasm = true;
    try {
      await this.wasmService.loadWasmModule();
      this.isWasmLoaded = true;
      const wasmType = this.wasmService.isUsingRealWasm() ? 'Real WebAssembly' : 'JavaScript Fallback';
      this.addResult('System', `${wasmType} Module Loaded`, 1, 0);
    } catch (error) {
      console.error('Failed to load WASM:', error);
      this.addResult('System', 'Failed to load WebAssembly', 0, 0);
    } finally {
      this.loadingWasm = false;
    }
  }

  async performAdd() {
    if (!this.isWasmLoaded) return;
    
    const start = performance.now();
    const result = await this.wasmService.add(this.addA, this.addB);
    const end = performance.now();
    
    this.addResult('Add', `${this.addA} + ${this.addB}`, result, end - start);
  }

  async performMultiply() {
    if (!this.isWasmLoaded) return;
    
    const start = performance.now();
    const result = await this.wasmService.multiply(this.multiplyA, this.multiplyB);
    const end = performance.now();
    
    this.addResult('Multiply', `${this.multiplyA} × ${this.multiplyB}`, result, end - start);
  }

  async performFactorial() {
    if (!this.isWasmLoaded) return;
    
    const start = performance.now();
    const result = await this.wasmService.factorial(this.factorialN);
    const end = performance.now();
    
    this.addResult('Factorial', `${this.factorialN}!`, result, end - start);
  }

  async runPerformanceTest() {
    if (!this.isWasmLoaded) return;
    
    this.runningPerformanceTest = true;
    try {
      this.performanceResults = await this.wasmService.performanceTest(100000);
      const testType = this.performanceResults.usingRealWasm ? 'JS vs Real WASM' : 'JS vs JS Fallback';
      this.addResult('Performance Test', `${testType} (100k iterations)`, this.performanceResults.speedup, 0);
    } catch (error) {
      console.error('Performance test failed:', error);
    } finally {
      this.runningPerformanceTest = false;
    }
  }

  private addResult(operation: string, input: string, result: number, executionTime: number) {
    this.results.unshift({
      operation,
      input,
      result,
      executionTime: Math.round(executionTime * 1000) / 1000, // Round to 3 decimal places
      timestamp: new Date()
    });

    // Keep only the last 10 results
    if (this.results.length > 10) {
      this.results = this.results.slice(0, 10);
    }
  }

  clearResults() {
    this.results = [];
  }
}
