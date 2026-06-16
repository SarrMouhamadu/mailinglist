import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { PreOrder } from '../../core/models/pre-order.model';

@Injectable({
  providedIn: 'root'
})
export class StandService {

  constructor(private apiService: ApiService) { }

  submitFinal(data: Partial<PreOrder>) {
    return this.apiService.createPreOrder(data as PreOrder);
  }
}
