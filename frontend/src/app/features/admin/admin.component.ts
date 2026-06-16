import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ApiService } from '../../core/services/api.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PreOrder } from '../../core/models/pre-order.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule, FormsModule, ButtonComponent],
  styles: [`
    :host {
      display: block;
      width: 100%;
      padding: 2rem 1.5rem;
    }

    /* LOGIN */
    .login-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
    }
    .login-box {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(20,184,166,0.2);
      border-radius: 20px;
      padding: 2.5rem 2rem;
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      text-align: center;
    }
    .login-box h2 { font-size: 1.6rem; font-weight: 700; }
    .login-box p { color: #94a3b8; }
    .pw-input {
      width: 100%;
      padding: 14px 18px;
      border-radius: 12px;
      border: 1px solid rgba(20,184,166,0.3);
      background: rgba(255,255,255,0.07);
      color: #f8fafc;
      font-size: 1.1rem;
      font-family: 'Outfit', sans-serif;
      outline: none;
    }
    .pw-input:focus { border-color: #14b8a6; box-shadow: 0 0 0 3px rgba(20,184,166,0.2); }
    .err { color: #ef4444; font-size: 0.9rem; }

    /* DASHBOARD */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .top-bar h2 { font-size: 1.8rem; font-weight: 700; color: #f8fafc; }
    .top-bar p { color: #94a3b8; margin-top: 4px; }

    /* TABLE */
    .table-wrap {
      width: 100%;
      overflow-x: auto;
      border-radius: 14px;
      border: 1px solid rgba(20,184,166,0.2);
      background: rgba(0,0,0,0.2);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 900px;
    }
    thead th {
      background: rgba(20,184,166,0.12);
      color: #14b8a6;
      padding: 14px 16px;
      text-align: left;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      white-space: nowrap;
    }
    tbody tr {
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    tbody tr:hover { background: rgba(255,255,255,0.03); }
    td {
      padding: 14px 16px;
      font-size: 0.95rem;
      color: #e2e8f0;
    }
    .name-td { font-weight: 700; color: #ffffff; white-space: nowrap; }
    .muted-td { color: #4b5563; }
    .badge {
      display: inline-block;
      background: rgba(20,184,166,0.15);
      color: #14b8a6;
      border: 1px solid rgba(20,184,166,0.3);
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .empty-state {
      text-align: center;
      color: #4b5563;
      padding: 4rem;
      font-size: 1rem;
    }

    /* MOBILE CARDS */
    .cards-list { display: none; flex-direction: column; gap: 1rem; }
    .card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(20,184,166,0.15);
      border-radius: 16px;
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .card-name { font-weight: 700; font-size: 1.05rem; color: #fff; }
    .card-meta { display: flex; flex-wrap: wrap; gap: 0.3rem 0.8rem; }
    .card-field { font-size: 0.85rem; color: #94a3b8; }
    .card-field span { color: #e2e8f0; }

    @media (max-width: 900px) {
      :host { padding: 1rem; }
      .cards-list { display: flex; }
      .table-wrap { display: none; }
    }
  `],
  template: `
    <!-- LOGIN -->
    <div class="login-wrap" *ngIf="!isAuthenticated">
      <div class="login-box">
        <h2>🔒 Zone Sécurisée</h2>
        <p>Entrez le mot de passe pour accéder aux précommandes.</p>
        <input class="pw-input" type="password" [(ngModel)]="password"
               placeholder="Mot de passe" (keyup.enter)="login()" />
        <p class="err" *ngIf="errorMsg">{{ errorMsg }}</p>
        <app-button text="Accéder" (onClick)="login()"></app-button>
      </div>
    </div>

    <!-- DASHBOARD -->
    <ng-container *ngIf="isAuthenticated">
      <div class="top-bar">
        <div>
          <h2>📊 Tableau de Bord (Précommandes)</h2>
          <p>{{ orders.length }} précommande(s) enregistrée(s)</p>
        </div>
        <app-button text="📥 Exporter en Excel" (onClick)="exportToExcel()"></app-button>
      </div>

      <!-- Desktop table -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Nom complet</th>
              <th>WhatsApp</th>
              <th>Offre</th>
              <th>Véhicules</th>
              <th>Types</th>
              <th>Démarrage</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let o of orders; trackBy: trackById">
              <td>{{ formatDate(o.created_at) }}</td>
              <td class="name-td">{{ o.full_name }}</td>
              <td>{{ o.whatsapp }}</td>
              <td><span class="badge">{{ o.package === 'yearly' ? 'Annuelle' : 'Mensuelle' }}</span></td>
              <td>{{ o.vehicle_count }}</td>
              <td>{{ formatArray(o.vehicle_types) }}</td>
              <td>{{ o.start_type === 'immediate' ? 'Immédiat' : formatDateOnly(o.start_date) }}</td>
              <td>{{ o.source }}</td>
            </tr>
            <tr *ngIf="orders.length === 0">
              <td colspan="8" class="empty-state">Aucune précommande enregistrée.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div class="cards-list">
        <div class="card" *ngFor="let o of orders; trackBy: trackById">
          <div class="card-name">{{ o.full_name }}</div>
          <div class="card-meta">
            <div class="card-field">📅 <span>{{ formatDate(o.created_at) }}</span></div>
            <span class="badge">{{ o.package === 'yearly' ? 'Annuelle' : 'Mensuelle' }}</span>
          </div>
          <div class="card-meta">
            <div class="card-field">💬 <span>{{ o.whatsapp }}</span></div>
            <div class="card-field">🚗 <span>{{ o.vehicle_count }} ({{ formatArray(o.vehicle_types) }})</span></div>
            <div class="card-field">🚀 <span>Démarrage: {{ o.start_type === 'immediate' ? 'Immédiat' : formatDateOnly(o.start_date) }}</span></div>
          </div>
        </div>
        <div class="card empty-state" *ngIf="orders.length === 0">Aucune précommande.</div>
      </div>
    </ng-container>
  `
})
export class AdminComponent implements OnInit {
  isAuthenticated = false;
  password = '';
  errorMsg = '';
  orders: any[] = [];

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('isAdmin') === 'true') {
      this.isAuthenticated = true;
      this.loadData();
    }
  }

  login() {
    if (this.password === 'karangue2026') {
      this.isAuthenticated = true;
      sessionStorage.setItem('isAdmin', 'true');
      this.loadData();
    } else {
      this.errorMsg = 'Mot de passe incorrect.';
    }
  }

  loadData() {
    this.apiService.getPreOrders().subscribe({
      next: (data: any) => {
        this.orders = Array.isArray(data) ? [...data] : [];
        this.cdr.detectChanges();
        console.log(`[Admin] ${this.orders.length} précommande(s) chargée(s)`, this.orders);
      },
      error: (err) => {
        console.error('[Admin] Erreur chargement:', err);
      }
    });
  }

  trackById(index: number, o: any) {
    return o.id;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  formatDateOnly(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatArray(arr: any): string {
    if (!arr) return '-';
    if (Array.isArray(arr)) return arr.join(', ');
    return String(arr);
  }

  exportToExcel() {
    const excelData = this.orders.map(o => ({
      'Date inscription': this.formatDate(o.created_at),
      'Nom complet': o.full_name,
      'WhatsApp': o.whatsapp,
      'Offre': o.package === 'yearly' ? 'Annuelle' : 'Mensuelle',
      'Nb Véhicules': o.vehicle_count,
      'Types': this.formatArray(o.vehicle_types),
      'Démarrage': o.start_type === 'immediate' ? 'Immédiat' : this.formatDateOnly(o.start_date),
      'Source': o.source
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Précommandes');
    ws['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 20 }, { wch: 20 }];
    XLSX.writeFile(wb, 'Precommandes_AI_Karangue.xlsx');
  }
}
