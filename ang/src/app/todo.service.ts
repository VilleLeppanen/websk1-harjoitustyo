import { Injectable } from "@angular/core";
import { ToDo } from "./dataclasses";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class TodoService {
  private apiUrl = "https://kulunvalvonta.azurewebsites.net/todo"; // osoite
  private tokenheaders = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "x-access-token": this.authService.token
    })
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Virheenkäsittelymetodi joka palauttaa observablen
  private handleError(error: any): Observable<any> {
    console.error("An error occurred", error);
    return error.message || error;
  }

  /*** ***/

  // Henkilön todo haku.
  getTodo(): Observable<ToDo[]> {
    console.log("GET: " + this.apiUrl);

    return this.http
      .get<ToDo[]>(this.apiUrl, { params: { Henkilo: this.authService.user } })
      .pipe(catchError(this.handleError));
  }

  // Henkilön todo haku.
  getAllTodo(): Observable<ToDo[]> {
    console.log("GET: " + this.apiUrl);

    return this.http
      .get<ToDo[]>(this.apiUrl, { params: { Henkilo: "%" } })
      .pipe(catchError(this.handleError));
  }

  // todo lisäsys.
  addTodo(tehtava): Observable<ToDo[]> {
    console.log("POST: " + this.apiUrl);

    const params = {
      Henkilo: this.authService.user,
      Tehtava: tehtava
    };

    return this.http
      .post<ToDo[]>(this.apiUrl, params, this.tokenheaders)
      .pipe(catchError(this.handleError));
  }

  // todo poisto.
  deleteTodo(parameters): Observable<ToDo[]> {
    console.log("DELETE: " + this.apiUrl);

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.authService.token
      }),
      body: {
        Henkilo: parameters.Henkilo,
        Tehtava: parameters.Tehtava
      }
    };

    return this.http
      .delete<ToDo[]>(this.apiUrl, options)
      .pipe(catchError(this.handleError));
  }
}
