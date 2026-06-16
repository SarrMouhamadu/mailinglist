import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type" 
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      class="custom-button"
      [ngClass]="{'disabled': disabled}">
      {{ text }}
    </button>
  `,
  styles: [`
    .custom-button {
      width: 100%;
      padding: 18px 24px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      border: none;
      border-radius: 16px;
      font-size: 1.3rem;
      font-weight: 600;
      font-family: 'Outfit', sans-serif;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(20, 184, 166, 0.3);
      position: relative;
      overflow: hidden;
    }
    
    .custom-button::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, var(--secondary), var(--primary));
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
    }
    
    .custom-button:hover:not(.disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(20, 184, 166, 0.5);
    }
    
    .custom-button.disabled {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.4);
      cursor: not-allowed;
      box-shadow: none;
    }
  `]
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<Event>();
}
