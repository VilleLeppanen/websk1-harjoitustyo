import { Component, OnInit } from "@angular/core";
import { KulunvalService } from "../kulunval.service";
import { TodoService } from "../todo.service";

@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.css"]
})
export class StatisticsComponent implements OnInit {
  countHenkilos: number;
  countTodos: number;

  constructor(
    private kulunvalService: KulunvalService,
    private todoService: TodoService
  ) {}

  ngOnInit() {
    // henkilöiden haku ja niiden lasku
    this.kulunvalService.getHenkilos().subscribe(res => {
      console.log("Henkilöitä on " + res.length);
      this.countHenkilos = res.length;
    });

    // todo haku ja niiden lasku
    this.todoService.getAllTodo().subscribe(res => {
      console.log("Tehtäviä on " + res.length);
      this.countTodos = res.length;
    });
  }
}
