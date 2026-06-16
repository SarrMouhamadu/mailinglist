export interface PreOrder {
  id?: number;
  fullName: string;
  whatsapp: string;
  package: 'monthly' | 'yearly';
  vehicleCount: number;
  vehicleTypes: string[];
  startType: 'immediate' | 'scheduled';
  startDate?: string;
  source: 'KAI_SUMMIT_2026';
  created_at?: string;
}
