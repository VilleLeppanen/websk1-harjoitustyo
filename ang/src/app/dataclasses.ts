import { Time } from "@angular/common";

export class User {
  username: string;
  password: string;
  isadmin: boolean;
}

export interface Kulunvalvonta {
  Henkilo: string;
  Alkoi: Date;
  Paattyi: Date;
  Kesto: Time;
}

export interface ToDo {
  Henkilo: string;
  Tehtava: string;
}
