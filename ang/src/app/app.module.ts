import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { AuthGuard } from "./auth.guard";
import { AppRoutingModule } from "./app-routing.module";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MAT_DATE_LOCALE } from "@angular/material/core";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { HistoryComponent } from "./history/history.component";
import { FrameComponent, DialogComponent } from "./frame/frame.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { TodoComponent } from "./todo/todo.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HistoryComponent,
    FrameComponent,
    StatisticsComponent,
    DialogComponent,
    TodoComponent
  ],
  entryComponents: [DialogComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule
  ],
  providers: [AuthGuard, { provide: MAT_DATE_LOCALE, useValue: "fi-FI" }],
  bootstrap: [AppComponent]
})
export class AppModule {}

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch(err => console.error(err));
