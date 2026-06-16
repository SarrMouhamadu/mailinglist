import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-container fade-in">
      <div class="icon-wrapper">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>
      
      <h2 class="text-gradient">Inscription Validée !</h2>
      <p class="subtitle">Merci de votre visite sur notre stand.</p>

      <div class="qr-mockup">
        <div class="qr-corner top-left"></div>
        <div class="qr-corner top-right"></div>
        <div class="qr-corner bottom-left"></div>
        <div class="qr-corner bottom-right"></div>
        <div class="qr-inner">
          <svg viewBox="0 0 100 100" fill="var(--primary)" opacity="0.8">
            <rect x="10" y="10" width="30" height="30" rx="5"/>
            <rect x="60" y="10" width="30" height="30" rx="5"/>
            <rect x="10" y="60" width="30" height="30" rx="5"/>
            <rect x="20" y="20" width="10" height="10"/>
            <rect x="70" y="20" width="10" height="10"/>
            <rect x="20" y="70" width="10" height="10"/>
            <path d="M50 10h5v20h-5zM60 50h30v5H60zM10 50h30v5H10zM50 60h20v5H50zM70 70h20v5H70z" />
          </svg>
        </div>
      </div>
      
      <p class="qr-text">Scannez pour obtenir la documentation</p>
      
      <button class="reset-btn" (click)="reset()">Nouveau Visiteur</button>
    </div>
  `,
  styles: [`
    .success-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2rem 0;
    }
    
    .subtitle {
      color: var(--text-muted);
      margin-bottom: 2.5rem;
    }
    
    .icon-wrapper {
      margin-bottom: 1.5rem;
    }
    
    .checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: block;
      stroke-width: 3;
      stroke: var(--primary);
      stroke-miterlimit: 10;
      box-shadow: inset 0px 0px 0px var(--primary);
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    }

    .checkmark__circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 3;
      stroke-miterlimit: 10;
      stroke: var(--primary);
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    .checkmark__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }
    
    .qr-mockup {
      width: 180px;
      height: 180px;
      background: white;
      border-radius: 16px;
      position: relative;
      padding: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      margin-bottom: 1rem;
    }
    
    .qr-corner {
      position: absolute;
      width: 20px; height: 20px;
      border: 3px solid var(--primary);
    }
    .top-left { top: -10px; left: -10px; border-right: none; border-bottom: none; border-top-left-radius: 12px;}
    .top-right { top: -10px; right: -10px; border-left: none; border-bottom: none; border-top-right-radius: 12px;}
    .bottom-left { bottom: -10px; left: -10px; border-right: none; border-top: none; border-bottom-left-radius: 12px;}
    .bottom-right { bottom: -10px; right: -10px; border-left: none; border-top: none; border-bottom-right-radius: 12px;}
    
    .qr-inner {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .qr-text {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 2rem;
    }
    
    .reset-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    
    .reset-btn:hover {
      background: rgba(255,255,255,0.1);
      border-color: var(--text-muted);
    }
    
    @keyframes stroke {
      100% { stroke-dashoffset: 0; }
    }
    @keyframes scale {
      0%, 100% { transform: none; }
      50% { transform: scale3d(1.1, 1.1, 1); }
    }
    @keyframes fill {
      100% { box-shadow: inset 0px 0px 0px 30px rgba(20, 184, 166, 0.1); }
    }
  `]
})
export class SuccessComponent implements OnInit {
  
  constructor(private router: Router) {}
  
  ngOnInit() {}
  
  reset() {
    // In a real app we might reset the service state here
    this.router.navigate(['/step1']);
  }
}
