import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

@Component({
  imports: [RouterModule, AppComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'trpc-angular-demo';
}
