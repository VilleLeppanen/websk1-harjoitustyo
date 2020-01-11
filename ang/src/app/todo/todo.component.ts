import { Component, OnInit } from "@angular/core";
import { TodoService } from "../todo.service";
import { ToDo } from "../dataclasses";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.css"]
})
export class TodoComponent implements OnInit {
  todolist: ToDo[] = [];
  deleteTodo: ToDo[] = [];

  // hae todoot
  getTodos(): void {
    this.todoService.getTodo().subscribe(todos => {
      console.log("RES: " + todos);
      this.todolist = todos;
    });
  }

  // lisää todo
  addNewTodo(Tehtava: string): void {
    if (Tehtava) {
      this.todoService.addTodo(Tehtava).subscribe(res => {
        console.log(res);
        this.getTodos();
      });
    }
  }

  // poista valitut todo
  delTodo(Henkilo: string, Tehtava: string): void {
    console.log(Henkilo + Tehtava);

    this.todoService.deleteTodo({ Henkilo, Tehtava }).subscribe(res => {
      console.log(res);
      this.getTodos();
    });
  }

  // lisää tai poistaa todoon delete listasta.
  todoToDeleteList(todo) {
    if (todo.Status) {
      // true kun checked ja false uncheck
      console.log("Push new.");
      this.deleteTodo.push(todo.Data);
      console.log(this.deleteTodo);
    } else {
      console.log("Filter unchecked.");
      this.deleteTodo = this.filterArray(this.deleteTodo, todo.Data);
      console.log(this.deleteTodo);
    }
  }

  // filtteröi taulukon. Tämä käytössä kun checkbox un chekataan
  filterArray(arr, value) {
    return arr.filter(ele => {
      return ele.Tehtava != value.Tehtava;
    });
  }

  // poistaa valitut todoot.
  clearDeleteList() {
    this.deleteTodo.forEach(todo => {
      console.log("Deleting: " + todo.Tehtava);
      this.delTodo(todo.Henkilo, todo.Tehtava);
    });
    this.deleteTodo = [];
  }

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.getTodos();
  }
}
