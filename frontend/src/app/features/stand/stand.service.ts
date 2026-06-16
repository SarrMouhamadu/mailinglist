import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Visitor } from '../../core/models/visitor.model';

@Injectable({
  providedIn: 'root'
})
export class StandService {

  constructor(private apiService: ApiService) { }

  submitFinal(data: Partial<Visitor>) {
    return this.apiService.createVisitor(data as Visitor);
  }
}
