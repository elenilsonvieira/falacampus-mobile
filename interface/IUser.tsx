import { IRole } from "./IRole";

export interface IUser{
    id: number;
    name: string;
    email: string;
    username: string;
    password: string
    departamentId: number;
    roles:IRole[]
    responsable:[]
}