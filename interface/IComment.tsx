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
 import { StatusKey } from "@/constants/statusLabel";
//Estrutura do backend
export interface IComment {
  id: string;
  title: string;
  message: string;
  creationDate: string;
  commentType: string;
  statusComment: StatusKey;
  authorId: number;
  departamentId: number;
  answerId?: number | null;
}
