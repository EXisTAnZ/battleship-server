export default interface User {
  index?: number;
  name: string;
  password?: string;
  error?: boolean;
  errorMessage?: string;
}
