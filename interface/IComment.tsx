// export interface IComment {
//   id: string;
//   title: string;
//   message: string;
//   author: string;
//   department: string;
//   date: string;
//   type: string;
//   status?: string;
//   response?: string;
// }

//Estrutura do backend
export interface IComment {
  id: string;
  title: string;
  message: string;
  creationDate: string;
  commentType: string;
  statusComment: string;
  authorId: number;
  departamentId: number;
  answerId?: number | null;
}