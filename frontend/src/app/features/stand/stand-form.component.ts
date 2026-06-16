import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormArray, FormControl } from '@angular/forms';
import { StandService } from './stand.service';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PreOrder } from '../../core/models/pre-order.model';

function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value || '').trim();
  if (!value) return { required: true };
  const phoneRegex = /^[+]?[\d\s\-().]{7,15}$/;
  return phoneRegex.test(value) ? null : { invalidPhone: true };
}

@Component({
  selector: 'app-stand-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <div class="step-container fade-in">
      <div class="header text-center">
        <h1 class="text-gradient">Précommande AI Karangué</h1>
        <p>Réservez votre solution dès aujourd'hui. Une interface fluide et repensée pour vous.</p>
      </div>

      <form [formGroup]="standForm" (ngSubmit)="onSubmit()">
        
        <div class="desktop-grid">
          
          <!-- COLONNE GAUCHE: Informations & Offre -->
          <div class="grid-column">
            <h3 class="section-title">1. Informations générales</h3>
            
            <div class="form-row">
              <app-input 
                formControlName="fullName" 
                label="Nom et prénom *" 
                placeholder="Ex: Amadou Ndiaye"
                [error]="getError('fullName')">
              </app-input>

              <app-input 
                formControlName="whatsapp" 
                label="Numéro WhatsApp *" 
                placeholder="Ex: +221 77 000 00 00"
                [error]="getError('whatsapp')">
              </app-input>
            </div>

            <!-- Package Section -->
            <div class="section-container" style="margin-top: 1.5rem;">
              <label class="input-label">2. Offre choisie *</label>
              <div class="radio-group">
                <label class="radio-card" [class.active]="standForm.get('package')?.value === 'monthly'">
                  <input type="radio" formControlName="package" value="monthly">
                  <div class="radio-content">
                    <span class="radio-label">Offre mensuelle</span>
                    <span class="radio-price">9 900 FCFA</span>
                  </div>
                </label>
                <label class="radio-card" [class.active]="standForm.get('package')?.value === 'yearly'">
                  <input type="radio" formControlName="package" value="yearly">
                  <div class="radio-content">
                    <span class="radio-label">Offre annuelle</span>
                    <span class="radio-price">100 000 FCFA</span>
                  </div>
                </label>
              </div>
              <span class="error-hint" *ngIf="getError('package')">{{ getError('package') }}</span>
            </div>
          </div>

          <!-- COLONNE DROITE: Flotte & Démarrage -->
          <div class="grid-column">
            <h3 class="section-title">3. Votre flotte</h3>

            <div class="form-row form-row-align-top">
              <!-- Vehicle Count -->
              <div class="section-container" style="flex: 0.5;">
                <app-input 
                  formControlName="vehicleCount" 
                  label="Nombre de véhicules *" 
                  type="number"
                  placeholder="Ex: 10"
                  [error]="getError('vehicleCount')">
                </app-input>
              </div>

              <!-- Start Date -->
              <div class="section-container" style="flex: 1;">
                <label class="input-label">Date de démarrage souhaitée *</label>
                <div class="radio-group-inline">
                  <label class="radio-inline">
                    <input type="radio" formControlName="startType" value="immediate">
                    <span>Immédiatement</span>
                  </label>
                  <label class="radio-inline">
                    <input type="radio" formControlName="startType" value="scheduled">
                    <span>Date précise</span>
                  </label>
                </div>
                
                <div class="date-picker-container fade-in" *ngIf="standForm.get('startType')?.value === 'scheduled'">
                  <app-input 
                    formControlName="startDate" 
                    type="text"
                    placeholder="Ex: 15/08/2026 ou la semaine prochaine"
                    [error]="getError('startDate')">
                  </app-input>
                </div>
              </div>
            </div>

            <!-- Vehicle Types -->
            <div class="section-container" style="margin-top: 1.5rem;">
              <label class="input-label">Types de véhicules dans votre flotte *</label>
              <div class="chips-container">
                <button 
                  *ngFor="let type of vehicleTypeOptions" 
                  type="button"
                  class="chip" 
                  [ngClass]="{'active': isVehicleTypeSelected(type)}"
                  (click)="toggleVehicleType(type)">
                  {{ type }}
                </button>
              </div>
              <span class="error-hint" *ngIf="showVehicleTypeError">Sélectionnez au moins un type de véhicule.</span>
            </div>

          </div>

        </div> <!-- Fin de la grille -->

        <div class="action-bar text-center">
          <button type="submit" class="premium-button" [disabled]="submitting">
            {{ submitting ? 'Traitement en cours...' : 'Je précommande maintenant' }}
          </button>
        </div>
        
      </form>
    </div>
  `,
  styles: [`
    .text-center { text-align: center; }
    .step-container { display: flex; flex-direction: column; gap: 2rem; }
    .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .header p { color: var(--text-muted); font-size: 1.2rem; }
    
    .section-title { color: #f8fafc; font-size: 1.3rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; text-align: left; }
    .section-container { margin-bottom: 1.2rem; text-align: left; }
    .input-label { font-size: 1.1rem; color: var(--text-muted); font-weight: 500; margin-bottom: 0.6rem; display: block; text-align: left; }
    
    /* Grille principale (Split 50/50 sur desktop) */
    .desktop-grid { display: flex; flex-direction: column; gap: 2.5rem; }
    @media (min-width: 992px) {
      .desktop-grid { flex-direction: row; gap: 4rem; }
      .grid-column { flex: 1; display: flex; flex-direction: column; }
    }

    /* Lignes dans les colonnes */
    .form-row { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.2rem; }
    @media (min-width: 600px) {
      .form-row { flex-direction: row; gap: 1.5rem; }
      .form-row > * { flex: 1; margin-bottom: 0 !important; }
      .form-row-align-top { align-items: flex-start; }
    }

    /* Radio Cards */
    .radio-group { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.2rem; }
    @media (min-width: 600px) { .radio-group { flex-direction: row; } }
    
    .radio-card {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
    }
    .radio-card input { display: none; }
    .radio-card.active {
      background: rgba(20, 184, 166, 0.15);
      border-color: var(--primary);
      box-shadow: 0 0 20px rgba(20, 184, 166, 0.2);
      transform: translateY(-2px);
    }
    .radio-content { display: flex; flex-direction: column; gap: 0.5rem; }
    .radio-label { font-size: 1.1rem; font-weight: 500; color: #e2e8f0; }
    .radio-price { font-size: 1.4rem; font-weight: 700; color: var(--primary); }

    /* Checkboxes as Chips */
    .chips-container { display: flex; flex-wrap: wrap; gap: 0.8rem; }
    .chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      padding: 12px 20px;
      border-radius: 30px;
      font-size: 1.05rem;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      transition: all 0.2s ease;
    }
    .chip:hover { background: rgba(255, 255, 255, 0.1); }
    .chip.active {
      background: var(--primary);
      color: var(--bg-dark);
      border-color: var(--primary);
      font-weight: 700;
    }

    /* Inline Radios */
    .radio-group-inline { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 0.8rem; }
    .radio-inline {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: var(--text-main);
      font-size: 1.1rem;
    }
    .radio-inline input { accent-color: var(--primary); width: 1.2rem; height: 1.2rem; }
    
    .date-picker-container { margin-top: 0.5rem; }

    /* Premium Button */
    .action-bar { margin-top: 3rem; }
    .premium-button {
      background: linear-gradient(135deg, #14b8a6, #008080);
      color: white;
      border: none;
      padding: 18px 40px;
      font-size: 1.3rem;
      font-weight: 700;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(20, 184, 166, 0.4);
      transition: all 0.3s ease;
      font-family: 'Outfit', sans-serif;
    }
    .premium-button:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 15px 35px rgba(20, 184, 166, 0.6);
    }
    .premium-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      box-shadow: none;
    }

    .error-hint {
      display: block;
      color: var(--error);
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
  `]
})
export class StandFormComponent implements OnInit {
  standForm: FormGroup;
  submitting = false;
  submitAttempted = false;

  vehicleTypeOptions = [
    'Taxi', 'VTC', 'Bus', 'Minibus', 'Camion', 'Véhicule particulier', 'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private standService: StandService
  ) {
    this.standForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      whatsapp: ['', [phoneValidator]],
      package: ['', [Validators.required]],
      vehicleCount: ['', [Validators.required, Validators.min(1)]],
      vehicleTypes: this.fb.array([]),
      startType: ['immediate', [Validators.required]],
      startDate: ['']
    });

    // Gestion dynamique de la validation de startDate
    this.standForm.get('startType')?.valueChanges.subscribe(val => {
      const startDateCtrl = this.standForm.get('startDate');
      if (val === 'scheduled') {
        startDateCtrl?.setValidators([Validators.required]);
      } else {
        startDateCtrl?.clearValidators();
        startDateCtrl?.setValue('');
      }
      startDateCtrl?.updateValueAndValidity();
    });
  }

  ngOnInit() {}

  get vehicleTypesArray(): FormArray {
    return this.standForm.get('vehicleTypes') as FormArray;
  }

  isVehicleTypeSelected(type: string): boolean {
    return this.vehicleTypesArray.value.includes(type);
  }

  toggleVehicleType(type: string) {
    const types = this.vehicleTypesArray;
    const index = types.value.indexOf(type);
    if (index >= 0) {
      types.removeAt(index);
    } else {
      types.push(new FormControl(type));
    }
  }

  get showVehicleTypeError(): boolean {
    return this.submitAttempted && this.vehicleTypesArray.length === 0;
  }

  getError(field: string): string {
    const ctrl = this.standForm.get(field);
    if (!ctrl || (!ctrl.touched && !this.submitAttempted) || ctrl.valid) return '';
    const e = ctrl.errors;
    if (!e) return '';
    if (e['required'])       return 'Ce champ est obligatoire.';
    if (e['minlength'])      return 'Texte trop court.';
    if (e['maxlength'])      return 'Texte trop long.';
    if (e['min'])            return 'La valeur doit être au moins 1.';
    if (e['invalidPhone'])   return 'Numéro WhatsApp invalide (utilisez un format comme +221...).';
    return 'Valeur invalide.';
  }

  onSubmit() {
    this.submitAttempted = true;

    // Mark all as touched
    Object.keys(this.standForm.controls).forEach(key => {
      this.standForm.get(key)?.markAsTouched();
    });

    if (this.standForm.invalid || this.vehicleTypesArray.length === 0) {
      return;
    }

    this.submitting = true;
    const val = this.standForm.value;

    const orderData: PreOrder = {
      fullName: val.fullName.trim(),
      whatsapp: val.whatsapp.trim(),
      package: val.package,
      vehicleCount: Number(val.vehicleCount),
      vehicleTypes: val.vehicleTypes,
      startType: val.startType,
      startDate: val.startType === 'scheduled' ? val.startDate : undefined,
      source: 'KAI_SUMMIT_2026'
    };

    this.standService.submitFinal(orderData).subscribe({
      next: () => {
        // Redirection en cas de succès vers le site commercial
        window.location.href = 'https://aikarangue.artbeaurescence.sn';
      },
      error: (err) => {
        console.error(err);
        this.submitting = false;
        alert("Erreur de connexion au serveur. Veuillez réessayer.");
      }
    });
  }
}
