import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AngularTestComponent } from './angular-test/angular-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AngularTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';
}
