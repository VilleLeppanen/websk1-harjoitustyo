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
        console.log("RES: " + res);
        this.getTodos(); // päivitetään lista
      });
    }
  }

  // poista valitut todo
  delTodo(Henkilo: string, Tehtava: string): void {
    console.log(Henkilo + Tehtava);

    this.todoService.deleteTodo({ Henkilo, Tehtava }).subscribe(res => {
      console.log("RES: " + res);
      this.getTodos(); // päivitetään lista
    });
  }

  // lisää tai poistaa todoon delete listasta.
  todoToDeleteList(todo) {
    if (todo.Status) {
      // kun todo checkbox chekataan
      console.log("Push new.");

      // lisäys taulukkoon
      this.deleteTodo.push(todo.Data);
      console.log(this.deleteTodo);
    } else {
      // kun todo checkbox unchekataan
      console.log("Filter unchecked.");

      // poisto taulukosta
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
    // listan läpikäynti ja chekattujen poisto
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
