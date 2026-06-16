import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-background">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <main class="app-container">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {
  title = 'frontend';
}
