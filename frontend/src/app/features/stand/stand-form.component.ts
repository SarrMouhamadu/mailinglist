import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { StandService } from './stand.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Visitor } from '../../core/models/visitor.model';

// Validateur personnalisé : email OU téléphone
function emailOrPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').trim();
  if (!value) return { required: true };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/;
  if (emailRegex.test(value) || phoneRegex.test(value)) return null;
  return { invalidContact: true };
}

// Validateur téléphone (optionnel mais si rempli doit être valide)
function optionalPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').trim();
  if (!value) return null; // champ optionnel
  const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/;
  return phoneRegex.test(value) ? null : { invalidPhone: true };
}

// Validateur : lettres, espaces, tirets, apostrophes uniquement
function nameValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').trim();
  if (!value) return { required: true };
  if (value.length < 2) return { minlength: true };
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'\-]+$/;
  return nameRegex.test(value) ? null : { invalidName: true };
}

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
            label="Prénom *" 
            placeholder="Ex: Amadou"
            [error]="getError('first_name')">
          </app-input>

          <app-input 
            formControlName="last_name" 
            label="Nom *" 
            placeholder="Ex: Ndiaye"
            [error]="getError('last_name')">
          </app-input>

          <app-input 
            formControlName="contact" 
            label="Email ou Téléphone *" 
            placeholder="Ex: amadou@email.com ou +221..."
            [error]="getError('contact')">
          </app-input>

          <div class="action-bar">
            <app-button 
              text="Continuer" 
              type="button" 
              [disabled]="step1Invalid"
              (onClick)="continueToStep2()">
            </app-button>
          </div>
        </div>

        <!-- SECTION 2 -->
        <div [class.hidden]="!showStep2" class="fade-in">
          <app-input 
            formControlName="whatsapp" 
            label="WhatsApp (optionnel)" 
            placeholder="+221..."
            [error]="getError('whatsapp')">
          </app-input>

          <div class="row">
            <app-input 
              formControlName="organization" 
              label="Organisation" 
              placeholder="Ex: K-AI"
              [error]="getError('organization')">
            </app-input>
            
            <app-input 
              formControlName="position" 
              label="Poste" 
              placeholder="Ex: CEO"
              [error]="getError('position')">
            </app-input>
          </div>

          <div class="profile-section">
            <label class="input-label">Profil *</label>
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
            <span class="error-hint" *ngIf="profileTouched && !standForm.get('profile')?.value">
              Veuillez sélectionner un profil
            </span>
          </div>

          <div class="action-bar flex-row">
            <button type="button" class="back-btn" (click)="showStep2 = false">← Retour</button>
            <div style="flex: 1;">
              <app-button 
                text="Valider" 
                type="submit"
                [disabled]="submitting">
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

    .error-hint {
      display: block;
      color: var(--error);
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    @media (max-width: 500px) {
      .row { grid-template-columns: 1fr; }
    }
  `]
})
export class StandFormComponent implements OnInit {
  standForm: FormGroup;
  showStep2 = false;
  submitting = false;
  profileTouched = false;

  profiles: {label: string, value: Visitor['profile']}[] = [
    { label: '🚀 Startup', value: 'startup' },
    { label: '💰 Investisseur', value: 'investor' },
    { label: '🏛️ Inst. Publique', value: 'public_institution' },
    { label: '🌍 ONG', value: 'ngo' },
    { label: '🎓 Université', value: 'university' },
    { label: '📚 Étudiant', value: 'student' },
    { label: '📺 Média', value: 'media' },
    { label: '🏢 Entreprise', value: 'private_company' },
    { label: '💻 Développeur', value: 'developer' },
    { label: '🔬 Chercheur', value: 'researcher' },
    { label: '✨ Autre', value: 'other' }
  ];

  constructor(
    private fb: FormBuilder,
    private standService: StandService,
    private router: Router
  ) {
    this.standForm = this.fb.group({
      first_name: ['', [nameValidator, Validators.maxLength(50)]],
      last_name:  ['', [nameValidator, Validators.maxLength(50)]],
      contact:    ['', [emailOrPhoneValidator]],
      whatsapp:   ['', [optionalPhoneValidator]],
      organization: ['', [Validators.maxLength(100)]],
      position:   ['', [Validators.maxLength(100)]],
      profile:    ['']
    });
  }

  ngOnInit() {}

  get step1Invalid(): boolean {
    return this.standForm.get('first_name')!.invalid ||
           this.standForm.get('last_name')!.invalid ||
           this.standForm.get('contact')!.invalid;
  }

  getError(field: string): string {
    const ctrl = this.standForm.get(field);
    if (!ctrl || !ctrl.touched || ctrl.valid) return '';
    const e = ctrl.errors;
    if (!e) return '';
    if (e['required'])       return 'Ce champ est obligatoire.';
    if (e['minlength'])      return 'Minimum 2 caractères.';
    if (e['maxlength'])      return 'Trop long (max 100 caractères).';
    if (e['invalidName'])    return 'Lettres uniquement (pas de chiffres ni symboles).';
    if (e['invalidContact']) return 'Entrez un email valide (ex: nom@email.com) ou un numéro de téléphone.';
    if (e['invalidPhone'])   return 'Numéro de téléphone invalide.';
    return 'Valeur invalide.';
  }

  continueToStep2() {
    // Marquer les champs de l'étape 1 comme touchés pour afficher les erreurs
    ['first_name', 'last_name', 'contact'].forEach(f => {
      this.standForm.get(f)!.markAsTouched();
    });
    if (!this.step1Invalid) {
      this.showStep2 = true;
    }
  }

  selectProfile(value: string) {
    this.profileTouched = true;
    this.standForm.patchValue({ profile: value });
  }

  onSubmit() {
    this.profileTouched = true;
    ['whatsapp', 'organization', 'position'].forEach(f => {
      this.standForm.get(f)!.markAsTouched();
    });

    // Le profil est requis
    if (!this.standForm.get('profile')?.value) return;
    if (this.standForm.get('whatsapp')!.invalid) return;

    this.submitting = true;
    const val = this.standForm.value;
    const isEmail = val.contact.includes('@');

    const visitorData: Partial<Visitor> = {
      first_name:   val.first_name.trim(),
      last_name:    val.last_name.trim(),
      email:        isEmail ? val.contact.trim() : undefined,
      phone:        !isEmail ? val.contact.trim() : undefined,
      whatsapp:     val.whatsapp?.trim() || undefined,
      organization: val.organization?.trim() || undefined,
      position:     val.position?.trim() || undefined,
      profile:      val.profile
    };

    this.standService.submitFinal(visitorData).subscribe({
      next: () => {
        this.router.navigate(['/success']);
      },
      error: (err) => {
        console.error(err);
        this.submitting = false;
        alert("Erreur de connexion au serveur. Veuillez réessayer.");
      }
    });
  }
}
