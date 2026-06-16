import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreOrder } from '../models/pre-order.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // En production (port 80 ou 8080 via Docker Nginx), on utilise le proxy relatif /api
  // En dev local (Angular sur port 4200), on appelle directement le backend
  private baseUrl = (['80', '8080', ''].includes(window.location.port))
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
