import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreOrder } from '../models/pre-order.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Si on est en développement local Angular (port 4200), on pointe vers le backend sur le port 3000
  // Sinon (Docker, Nginx sur n'importe quel port comme 80 ou 8080), on utilise le proxy relatif
  private baseUrl = window.location.port === '4200'
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
