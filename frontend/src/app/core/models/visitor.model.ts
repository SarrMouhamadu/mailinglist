export interface Visitor {
  first_name: string;
  last_name: string;

  email?: string;
  phone?: string;
  whatsapp?: string;

  organization?: string;
  position?: string;

  profile:
    | 'startup'
    | 'investor'
    | 'public_institution'
    | 'ngo'
    | 'university'
    | 'student'
    | 'media'
    | 'private_company'
    | 'developer'
    | 'researcher'
    | 'other';
}
