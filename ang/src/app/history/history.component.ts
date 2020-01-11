import { Component, OnInit, ViewChild } from "@angular/core";
import { KulunvalService } from "../kulunval.service";
import { User, Kulunvalvonta } from "../dataclasses";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"]
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ["Henkilo", "Alkoi", "Paattyi", "Kesto"];
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  today;
  leimaukset: MatTableDataSource<Kulunvalvonta>;
  henkilot: Array<User> = [];

  searchForm = new FormGroup({
    henkilo: new FormControl(""),
    date1: new FormControl(new Date()),
    date2: new FormControl(new Date())
  });

  constructor(private kulunvalService: KulunvalService) {}

  _getLeimaukset(formdata): void {
    if (formdata.date1) {
      formdata.date1 = formatDate(formdata.date1, "yyyy-MM-dd", "en");
    }
    if (formdata.date2) {
      formdata.date2 = formatDate(formdata.date2, "yyyy-MM-dd", "en");
    }

    console.log(formdata);

    this.kulunvalService
      .getLeimaukset({
        Henkilo: formdata.henkilo,
        pvmfrom: formdata.date1,
        pvmto: formdata.date2
      })
      .subscribe(data => {
        this.leimaukset = new MatTableDataSource(data);
        this.leimaukset.sort = this.sort;
      });
  }

  _getHenkilos(): void {
    this.kulunvalService
      .getHenkilos()
      .subscribe(data => (this.henkilot = data));
  }

  ngOnInit() {
    this.today = formatDate(new Date(), "yyyy-MM-dd", "en");
    this._getLeimaukset({ henkilo: "", date1: this.today, date2: this.today });
    this._getHenkilos(); // henkilöt taulukkoon
  }
}
