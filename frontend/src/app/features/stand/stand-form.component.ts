import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StandService } from './stand.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Visitor } from '../../core/models/visitor.model';

@Component({
  selector: 'app-stand-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <div class="step-container fade-in">
      <div class="header">
        <h1 class="text-gradient">{{ showStep2 ? 'Dernière étape' : 'Bienvenue' }}</h1>
        <p>{{ showStep2 ? 'Quelques détails pour mieux vous connaître.' : 'Commençons par faire connaissance.' }}</p>
      </div>

      <form [formGroup]="standForm" (ngSubmit)="onSubmit()">
        
        <!-- SECTION 1 -->
        <div [class.hidden]="showStep2" class="fade-in">
          <app-input 
            formControlName="first_name" 
            label="Prénom" 
            placeholder="Ex: Amadou">
          </app-input>

          <app-input 
            formControlName="last_name" 
            label="Nom" 
            placeholder="Ex: Ndiaye">
          </app-input>

          <app-input 
            formControlName="contact" 
            label="Email ou Téléphone" 
            placeholder="Ex: amadou@email.com ou +221...">
          </app-input>

          <div class="action-bar">
            <app-button 
              text="Continuer" 
              type="button" 
              [disabled]="standForm.get('first_name')!.invalid || standForm.get('last_name')!.invalid || standForm.get('contact')!.invalid"
              (onClick)="continueToStep2()">
            </app-button>
          </div>
        </div>

        <!-- SECTION 2 -->
        <div [class.hidden]="!showStep2" class="fade-in">
          <app-input 
            formControlName="whatsapp" 
            label="WhatsApp (optionnel)" 
            placeholder="+221...">
          </app-input>

          <div class="row">
            <app-input 
              formControlName="organization" 
              label="Organisation" 
              placeholder="Ex: K-AI">
            </app-input>
            
            <app-input 
              formControlName="position" 
              label="Poste" 
              placeholder="Ex: CEO">
            </app-input>
          </div>

          <div class="profile-section">
            <label class="input-label">Profil</label>
            <div class="chips-container">
              <button 
                *ngFor="let profile of profiles" 
                type="button"
                class="chip" 
                [ngClass]="{'active': standForm.get('profile')?.value === profile.value}"
                (click)="selectProfile(profile.value)">
                {{ profile.label }}
              </button>
            </div>
          </div>

          <div class="action-bar flex-row">
            <button type="button" class="back-btn" (click)="showStep2 = false">Retour</button>
            <div style="flex: 1;">
              <app-button 
                text="Valider" 
                type="submit">
              </app-button>
            </div>
          </div>
        </div>
        
      </form>
    </div>
  `,
  styles: [`
    .step-container { display: flex; flex-direction: column; gap: 2rem; }
    .header p { color: var(--text-muted); font-size: 1.1rem; }
    .hidden { display: none !important; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    
    .profile-section { margin-bottom: 2rem; }
    .input-label { font-size: 1.1rem; color: var(--text-muted); font-weight: 500; margin-bottom: 1rem; display: block; }
    
    .chips-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
    }
    
    .chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      padding: 12px 20px;
      border-radius: 30px;
      font-size: 1.1rem;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      transition: all 0.2s ease;
    }
    
    .chip.active {
      background: rgba(20, 184, 166, 0.25);
      border-color: var(--primary);
      color: white;
      box-shadow: 0 0 15px rgba(20, 184, 166, 0.4);
      transform: scale(1.05);
    }
    
    .action-bar { margin-top: 1.5rem; }
    .flex-row { display: flex; gap: 1rem; align-items: center; }
    
    .back-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 1.1rem;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      padding: 10px;
    }
  `]
})
export class StandFormComponent {
  standForm: FormGroup;
  showStep2 = false;

  profiles: {label: string, value: Visitor['profile']}[] = [
    { label: 'Startup', value: 'startup' },
    { label: 'Investisseur', value: 'investor' },
    { label: 'Inst. Publique', value: 'public_institution' },
    { label: 'ONG', value: 'ngo' },
    { label: 'Université', value: 'university' },
    { label: 'Étudiant', value: 'student' },
    { label: 'Média', value: 'media' },
    { label: 'Entreprise', value: 'private_company' },
    { label: 'Développeur', value: 'developer' },
    { label: 'Chercheur', value: 'researcher' },
    { label: 'Autre', value: 'other' }
  ];

  constructor(
    private fb: FormBuilder,
    private standService: StandService,
    private router: Router
  ) {
    this.standForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact: ['', Validators.required],
      whatsapp: [''],
      organization: [''],
      position: [''],
      profile: ['']
    });
  }

  continueToStep2() {
    this.showStep2 = true;
  }

  selectProfile(value: string) {
    this.standForm.patchValue({ profile: value });
  }

  onSubmit() {
    if (this.standForm.valid) {
      const val = this.standForm.value;
      const isEmail = val.contact.includes('@');
      
      const visitorData: Partial<Visitor> = {
        first_name: val.first_name,
        last_name: val.last_name,
        email: isEmail ? val.contact : undefined,
        phone: !isEmail ? val.contact : undefined,
        whatsapp: val.whatsapp,
        organization: val.organization,
        position: val.position,
        profile: val.profile
      };
      // Attendre la réponse avant de naviguer
      this.standService.submitFinal(visitorData).subscribe({
        next: () => {
          this.router.navigate(['/success']);
        },
        error: (err) => {
          console.error(err);
          alert("Erreur de connexion au serveur ! Impossible de valider l'inscription.");
        }
      });
    }
  }
}
