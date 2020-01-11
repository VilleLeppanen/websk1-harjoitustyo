import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(""),
    password: new FormControl("")
  });

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(user): void {
    if (user.username.length === 0 || user.password.length === 0) {
      alert("Syötä käyttäjätunnus ja salasana!");
    } else {
      this.authService.login(user.username, user.password).subscribe(result => {
        if (result.token) {
          // jos saadaan token
          console.log(result);
          this.router.navigate(["home"]);
        } else {
          alert(result.message);
        }
      });
    }
  }

  ngOnInit() {}
}
