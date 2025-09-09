import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasmDemo } from './wasm-demo';

describe('WasmDemo', () => {
  let component: WasmDemo;
  let fixture: ComponentFixture<WasmDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WasmDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WasmDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
