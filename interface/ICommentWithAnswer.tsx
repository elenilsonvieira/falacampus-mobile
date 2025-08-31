import { IAnswer } from "./IAnswer";
import { IComment } from "./IComment";

export interface ICommentWithAnswer {
  comment: IComment;
  answer?: IAnswer | null;
}
