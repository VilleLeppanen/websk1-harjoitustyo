import { Injectable } from "@angular/core";
import { Kulunvalvonta } from "./dataclasses";
import { Observable, interval } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { map, share } from "rxjs/operators";
import { AuthService } from "./auth.service";

const headers = new HttpHeaders({ "Content-Type": "application/json" });

@Injectable({
  providedIn: "root"
})
export class KulunvalService {
  private apiUrl = "https://kulunvalvonta.azurewebsites.net/kval"; // osoite
  private clock: Observable<Date>;
  private time: Observable<number>;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.clock = interval(1000).pipe(
      map(tick => new Date()),
      share()
    );
  }

  // Virheenkäsittelymetodi joka palauttaa observablen
  private handleError(error: any): Observable<any> {
    console.error("An error occurred", error);
    return error.message || error;
  }

  getClock(): Observable<Date> {
    return this.clock;
  }

  // Kaikkien leimauksien haku. Palauttaa observablena leimaukset
  getLeimaukset(params): Observable<Kulunvalvonta[]> {
    console.log(this.apiUrl);

    return this.http
      .get<Kulunvalvonta[]>(this.apiUrl, {
        params: {
          Henkilo: params.Henkilo,
          Pvmfrom: params.pvmfrom,
          Pvmto: params.pvmto
        }
      })
      .pipe(catchError(this.handleError));
  }

  getHenkilos(): Observable<any[]> {
    console.log(this.apiUrl + "/gethenkilos");

    return this.http
      .get<any[]>(this.apiUrl + "/gethenkilos")
      .pipe(catchError(this.handleError));
  }

  addStartTime(params): Observable<Kulunvalvonta> {
    console.log("POST: " + this.apiUrl + "/start");
    const tokenheaders = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.authService.token
      })
    };
    console.log(params);

    return this.http
      .post<Kulunvalvonta>(`${this.apiUrl}/start`, params, tokenheaders)
      .pipe(catchError(this.handleError));
  }

  addEndTime(params): Observable<Kulunvalvonta> {
    const url = this.apiUrl + "/end";
    console.log("POST: " + url);

    const tokenheaders = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-access-token": this.authService.token
      })
    };
    console.log(params);

    return this.http
      .post<Kulunvalvonta>(url, params, tokenheaders)
      .pipe(catchError(this.handleError));
  }
}
