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
      <div class="header">
        <h1 class="text-gradient">Précommande</h1>
        <p>Réservez votre solution AI Karangué dès aujourd'hui.</p>
      </div>

      <form [formGroup]="standForm" (ngSubmit)="onSubmit()">
        
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
        <div class="section-container">
          <label class="input-label">Offre choisie *</label>
          <div class="radio-group">
            <label class="radio-card" [class.active]="standForm.get('package')?.value === 'monthly'">
              <input type="radio" formControlName="package" value="monthly">
              <span class="radio-label">Offre mensuelle</span>
              <span class="radio-price">9 900 FCFA</span>
            </label>
            <label class="radio-card" [class.active]="standForm.get('package')?.value === 'yearly'">
              <input type="radio" formControlName="package" value="yearly">
              <span class="radio-label">Offre annuelle</span>
              <span class="radio-price">100 000 FCFA</span>
            </label>
          </div>
          <span class="error-hint" *ngIf="getError('package')">{{ getError('package') }}</span>
        </div>

        <div class="form-row form-row-align-top">
          <!-- Vehicle Count -->
          <div class="section-container">
            <app-input 
              formControlName="vehicleCount" 
              label="Nombre de véhicules *" 
              type="number"
              placeholder="Ex: 10"
              [error]="getError('vehicleCount')">
            </app-input>
          </div>

          <!-- Start Date -->
          <div class="section-container">
            <label class="input-label">Date de démarrage souhaitée *</label>
            <div class="radio-group-inline">
              <label class="radio-inline">
                <input type="radio" formControlName="startType" value="immediate">
                <span>Immédiatement</span>
              </label>
              <label class="radio-inline">
                <input type="radio" formControlName="startType" value="scheduled">
                <span>À une date précise</span>
              </label>
            </div>
            
            <!-- Text Input pour la date (Conditionnel) -->
            <div class="date-picker-container fade-in" *ngIf="standForm.get('startType')?.value === 'scheduled'">
              <app-input 
                formControlName="startDate" 
                type="text"
                placeholder="Ex: 15/08/2026 ou la semaine prochaine"
                label="Date prévue *" 
                [error]="getError('startDate')">
              </app-input>
            </div>
          </div>
        </div>

        <!-- Vehicle Types -->
        <div class="section-container" style="margin-top: 0.5rem;">
          <label class="input-label">Types de véhicules *</label>
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

        <div class="action-bar">
          <app-button 
            text="Je précommande maintenant" 
            type="submit"
            [disabled]="submitting">
          </app-button>
        </div>
        
      </form>
    </div>
  `,
  styles: [`
    .step-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .header p { color: var(--text-muted); font-size: 1.1rem; }
    .section-container { margin-top: 1rem; }
    .input-label { font-size: 1.1rem; color: var(--text-muted); font-weight: 500; margin-bottom: 0.8rem; display: block; }
    
    /* Radio Cards */
    .radio-group { display: flex; flex-direction: column; gap: 1rem; }
    .radio-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 15px 20px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .radio-card input { display: none; }
    .radio-card.active {
      background: rgba(20, 184, 166, 0.15);
      border-color: var(--primary);
      box-shadow: 0 0 10px rgba(20, 184, 166, 0.3);
    }
    .radio-label { font-size: 1.1rem; font-weight: 500; }
    .radio-price { font-size: 1.2rem; font-weight: 600; color: var(--primary); }

    /* Checkboxes as Chips */
    .chips-container { display: flex; flex-wrap: wrap; gap: 0.8rem; }
    .chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      padding: 10px 18px;
      border-radius: 30px;
      font-size: 1rem;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      transition: all 0.2s ease;
    }
    .chip.active {
      background: var(--primary);
      color: var(--bg-color);
      border-color: var(--primary);
      font-weight: 600;
    }

    /* Inline Radios */
    .radio-group-inline { display: flex; gap: 1.5rem; margin-bottom: 1rem; }
    .radio-inline {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: var(--text-muted);
      font-size: 1.1rem;
    }
    .radio-inline input { accent-color: var(--primary); width: 1.2rem; height: 1.2rem; }
    
    .date-picker-container { margin-top: 1rem; }

    .error-hint {
      display: block;
      color: var(--error);
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }
    .action-bar { margin-top: 2rem; }

    @media (min-width: 600px) {
      .radio-group { flex-direction: row; }
      .radio-card { flex: 1; }
    }
    
    /* Layout Horizontal sur Desktop pour éviter de scroller */
    .form-row { display: flex; flex-direction: column; gap: 1rem; }
    @media (min-width: 768px) {
      .form-row { flex-direction: row; gap: 2rem; }
      .form-row > * { flex: 1; }
      .form-row-align-top { align-items: flex-start; }
      
      /* Reduire les marges pour compacter l'espace vertical */
      .section-container { margin-top: 0.5rem; }
      .step-container { gap: 1rem; }
      .action-bar { margin-top: 1rem; }
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
