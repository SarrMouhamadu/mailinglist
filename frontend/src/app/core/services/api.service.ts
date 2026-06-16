import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreOrder } from '../models/pre-order.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // En développement Angular (port 4200), on appelle le backend directement
  // En production (Docker Nginx, quel que soit le port), on utilise le proxy /api
  private baseUrl = (window.location.port === '4200')
    ? `http://${window.location.hostname}:3000/api`
    : '/api';

  constructor(private http: HttpClient) {}

  createPreOrder(preOrder: PreOrder): Observable<PreOrder> {
    return this.http.post<PreOrder>(`${this.baseUrl}/pre-orders`, preOrder);
  }

  getPreOrders(): Observable<PreOrder[]> {
    return this.http.get<PreOrder[]>(`${this.baseUrl}/pre-orders`);
  }
}
