import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Visitor } from '../models/visitor.model';

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

  createVisitor(data: Visitor) {
    return this.http.post(`${this.baseUrl}/visitors`, data);
  }

  getVisitors() {
    return this.http.get(`${this.baseUrl}/visitors`);
  }
}
