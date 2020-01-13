import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { KulunvalService } from "../kulunval.service";
import { AuthService } from "../auth.service";
import { formatDate } from "@angular/common";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";

@Component({
  selector: "app-frame",
  templateUrl: "./frame.component.html",
  styleUrls: ["./frame.component.css"]
})
export class FrameComponent implements OnInit {
  public isAdmin: Observable<number> = this.authService.isAdmin();
  public user: Observable<string> = this.authService.getUsername();

  private timeSubscription: Subscription; // aikaa työskennelty tilaus

  public workStatus = false;
  public startTime: Date;
  public endTime: Date;
  public timeWorked: number;
  public hours = 0;
  public minutes = 0;
  public seconds = 0;

  constructor(
    private authService: AuthService,
    private kulunvalService: KulunvalService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  /*** authService ***/
  logout(): void {
    this.authService.logout();
    this.router.navigate(["login"]);
  }

  /*** snackBar ***/
  openSnackBar(message: string, snackColor: string) {
    this.snackBar.open(message, "Ok", {
      duration: 5000,
      verticalPosition: "top",
      panelClass: [snackColor]
    });
  }

  /*** kulunvalService ***/
  // Työn aloitus. Tallentaa käyttäjän nimen, pvm ja klo.
  startWork() {
    // luodaan startTime ja tallennetaan se l-storageen
    this.startTime = new Date();
    localStorage.setItem(
      this.user + "start",
      JSON.stringify({ time: this.startTime, user: this.user })
    );

    // tilataan aikaa ja lasketaan kauanko työskennelty
    this.timeSubscription = this.kulunvalService.getClock().subscribe(time => {
      this.timeWorked = time.getTime() - this.startTime.getTime();
      this.seconds = Math.floor((this.timeWorked % (1000 * 60)) / 1000);
      this.minutes = Math.floor(
        (this.timeWorked % (1000 * 60 * 60)) / (1000 * 60)
      );
      this.hours = Math.floor(
        (this.timeWorked % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
    });

    // Haetaan käyttäjä ja formatoidaan pvm
    const params = {
      Henkilo: this.user,
      Alkoi: formatDate(new Date(this.startTime), "yyyy-MM-dd hh:mm:ss", "en")
    };
    // console.log(params); // {Henkilo: "admin", Alkoi: "2020-01-04 02:01:10"}

    // välitetään params serviselle
    this.kulunvalService.addStartTime(params).subscribe(
      res => {
        console.log(`this.kulunval`, { res });
      },
      error => {
        console.log("Error", error);
      }
    );

    // snackbar viesti
    this.openSnackBar("Work started at " + params.Alkoi, "style-succes");
    this.workStatus = true;
  }

  // Työn lopetus
  endWork(): any {
    // lopetetaan ajan tilaus ja asetetaan endTime.
    this.timeSubscription.unsubscribe();
    this.endTime = new Date();

    // localStorage tyhjäksi
    localStorage.removeItem(this.user + "start");

    // backiin välitettävät parametrit
    const params = {
      Henkilo: this.user,
      Alkoi: formatDate(new Date(this.startTime), "yyyy-MM-dd hh:mm:ss", "en"),
      Paattyi: formatDate(new Date(this.endTime), "yyyy-MM-dd hh:mm:ss", "en")
    };
    // console.log(params); // {Henkilo: "admin", Alkoi: "2020-01-04 02:51:58", Paattyi: "2020-01-04 02:51:59"}

    // välitetään params serviselle
    this.kulunvalService.addEndTime(params).subscribe(
      res => {
        console.log(`this.kulunval`, { res });
      },
      error => {
        console.log("Error", error);
      }
    );

    // snackbar viesti
    this.openSnackBar("Work ended at " + params.Paattyi, "style-succes");

    // ajan näyttö piiloon
    this.workStatus = false;
  }

  // Kun työ aloitetaan startTime tallentuu localStorageen. Tämä katsoo
  // onko sinne tallennettu aika ja asettaa juoksevan ajan näkyviin.
  checkStart(): void {
    try {
      // kaatuu tässä jos ei löydy user - siksi try
      if (
        this.user === JSON.parse(localStorage.getItem(this.user + "start")).user
      ) {
        // startTime haku ja sen asetus new Date
        const savedStartTime = JSON.parse(
          localStorage.getItem(this.user + "start")
        ).time;
        this.startTime = new Date(savedStartTime);

        console.log(
          "Start time foundet. " + savedStartTime + " " + this.startTime
        );

        // start / stop napille tieto että juokseva-aika näkyviin.
        this.workStatus = true;

        // tilataan aikaa ja lasketaan kauanko työskennelty
        this.timeSubscription = this.kulunvalService
          .getClock()
          .subscribe(time => {
            this.timeWorked = time.getTime() - this.startTime.getTime();
            this.seconds = Math.floor((this.timeWorked % (1000 * 60)) / 1000);
            this.minutes = Math.floor(
              (this.timeWorked % (1000 * 60 * 60)) / (1000 * 60)
            );
            this.hours = Math.floor(
              (this.timeWorked % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
          });
      }
    } catch (error) {
      console.log("No start time." + error);
    }
  }

  /*** Dialog ***/
  // varmistaa työn lopetuksen
  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);

    // Valittaessa 'Yes' kutsuu endWork().
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.endWork();
      }
    });
  }

  ngOnInit() {
    this.checkStart();
  }
}

// Työnlopetuksen komponentti
@Component({
  selector: "dialog-content",
  templateUrl: "dialog-content.html"
})
export class DialogComponent {}
