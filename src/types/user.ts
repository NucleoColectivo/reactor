export interface UserProfile {
  id: string;
  displayName: string;
  email: string | null;
  registrationDate: string; // ISO 8601 string
}
