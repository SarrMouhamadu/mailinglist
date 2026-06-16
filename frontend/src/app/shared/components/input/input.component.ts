import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-container">
      <label *ngIf="label" class="input-label">{{ label }}</label>
      <input 
        [type]="type" 
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        class="custom-input"
        [ngClass]="{'has-error': error}">
      <span *ngIf="error" class="error-msg">{{ error }}</span>
    </div>
  `,
  styles: [`
    .input-container {
      margin-bottom: 1.2rem;
      display: flex;
      flex-direction: column;
      text-align: left;
    }
    .input-label {
      margin-bottom: 0.6rem;
      font-size: 1.1rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .custom-input {
      width: 100%;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      color: white;
      font-family: 'Outfit', sans-serif;
      font-size: 1.2rem;
      transition: all 0.3s ease;
      outline: none;
    }
    .custom-input:focus {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
    }
    .custom-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    .custom-input.has-error {
      border-color: var(--error);
    }
    .error-msg {
      color: var(--error);
      font-size: 0.8rem;
      margin-top: 0.4rem;
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() error: string = '';

  value: string = '';
  
  onChange: any = () => {};
  onTouched: any = () => {};

  onInputChange(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
