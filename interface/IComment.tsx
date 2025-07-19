export interface IComment {
  id: string;
  author: string;
  message: string;
  date: string;
  status?: string;
  response?: string;
}