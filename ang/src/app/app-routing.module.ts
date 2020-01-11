import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FrameComponent } from "./frame/frame.component";
import { LoginComponent } from "./login/login.component";
import { HistoryComponent } from "./history/history.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { HomeComponent } from "./home/home.component";
import { TodoComponent } from "./todo/todo.component";

import { AuthGuard } from "./auth.guard";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: FrameComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", pathMatch: "full", redirectTo: "home" },
      { path: "home", component: HomeComponent },
      { path: "history", component: HistoryComponent },
      { path: "todo", component: TodoComponent },
      { path: "statistics", component: StatisticsComponent }
    ]
  },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
