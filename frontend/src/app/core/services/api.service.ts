import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreOrder } from '../models/pre-order.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Si on est sur le port standard (Docker Nginx), on utilise le proxy relatif
  // Sinon (Dev Angular), on pointe vers le backend sur le port 3000
  private baseUrl = (window.location.port === '80' || window.location.port === '')
    ? '/api'
    : `http://${window.location.hostname}:3000/api`;

  constructor(private http: HttpClient) {}

  createPreOrder(preOrder: PreOrder): Observable<PreOrder> {
    return this.http.post<PreOrder>(`${this.baseUrl}/pre-orders`, preOrder);
  }

  getPreOrders(): Observable<PreOrder[]> {
    return this.http.get<PreOrder[]>(`${this.baseUrl}/pre-orders`);
  }
}
