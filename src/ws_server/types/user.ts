export default interface User {
  id?: number;
  name: string;
  password: string;
  error?: boolean;
  errorMessage?: string;
}
