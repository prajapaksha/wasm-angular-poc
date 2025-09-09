import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WasmDemo } from './components/wasm-demo/wasm-demo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WasmDemo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('wasm-angular-poc');
}
