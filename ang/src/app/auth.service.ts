import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt"; // kirjasto jwt:n käsittelyyn
import { Observable, Subscriber } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private apiUrl = "https://kulunvalvonta.azurewebsites.net/users"; // autentikaatiopalvelun osoite
  private jwtHelp = new JwtHelperService(); // helpperipalvelu jolla dekoodataan token
  public token: string;
  public user: string;
  public admin: Observable<number>;

  constructor(private http: HttpClient) {}

  // Virheenkäsittelymetodi joka palauttaa observablen
  private handleError(error: any): Observable<any> {
    console.error("An error occurred", error);
    return error.message || error;
  }

  /* login-metodi ottaa yhteyden backendin autentikaatioreittiin, postaa tunnarit
  ja palauttaa Observablena true tai false riippuen siitä saatiinko lähetetyillä
  tunnareilla token backendistä */
  login(Username: string, Password: string): Observable<any> {
    return this.http
      .post(this.apiUrl + "/login", { username: Username, password: Password })
      .pipe(
        map(result => {
          // console.log(result);
          // loggaa: {token: "eyJ...Eg", message: "Log in ok."}

          const token = result["token"]; // otetaan vastauksesta token
          if (token) {
            this.token = token;
            this.user = Username;

            // dekoodataan token
            const payload = this.jwtHelp.decodeToken(token);
            // console.log(payload);
            // loggaa: {username: "admin", isadmin: 1, iat: 1576494771, exp: 1576581171}
            this.admin = payload.isadmin;

            // token sessionStorageen
            localStorage.setItem(
              "accesstoken",
              JSON.stringify({ username: Username, token: token })
            );
            result["admin"] = payload.isadmin; // lisätään admin tieto
            return result;
          } else {
            // user not found
            return result;
          }
        })
      );
  }

  // jos token jäänyt localStorageen katsotaan onko se voimassa.
  checkToken(token): boolean {
    if (token) {
      const payload = this.jwtHelp.decodeToken(token);
      // console.log(payload);
      if (Date.now() >= payload.exp * 1000) {
        console.log("Token expired.");
        return false;
      } else {
        console.log("Token ok.");
        return true;
      }
    } else {
      console.log("no token");
      return false;
    }
  }

  // logout poistaa tokenin sessionStoragesta
  logout(): void {
    this.token = null;
    localStorage.removeItem("accesstoken");
  }

  // tämän tilaamalla erotellaan admin komponentteihin pääsy.
  isAdmin(): Observable<number> {
    const token = JSON.parse(localStorage.getItem("accesstoken")).token;
    const payload = this.jwtHelp.decodeToken(token);
    return payload.isadmin;
  }

  // tämän tilaamalla erotellaan admin komponentteihin pääsy.
  getUsername(): Observable<string> {
    const username = JSON.parse(localStorage.getItem("accesstoken")).username;
    return username;
  }
}
