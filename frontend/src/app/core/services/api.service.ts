import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Visitor } from '../models/visitor.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Utilisation de l'adresse IP dynamique pour que ça marche aussi sur tablette/téléphone
  private baseUrl = `http://${window.location.hostname}:3000/api`;

  constructor(private http: HttpClient) {}

  createVisitor(data: Visitor) {
    return this.http.post(`${this.baseUrl}/visitors`, data);
  }

  getVisitors() {
    return this.http.get(`${this.baseUrl}/visitors`);
  }
}
