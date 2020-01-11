import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  user: string;
  isAdmin: Observable<number> = this.authService.isAdmin();

  constructor(private authService: AuthService, private router: Router) {
    this.user = authService.user;
  }

  ngOnInit() {}
}
