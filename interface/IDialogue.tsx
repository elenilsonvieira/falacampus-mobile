export interface IDialogue{
    id: string;
    title:string;
    message:string;
    author: string;
    status: string;
    answerId: string | null;
    answerMessage:  string | null;
}