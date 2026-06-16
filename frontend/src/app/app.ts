import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-background">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <main class="app-container" [class.admin-page]="isAdminPage">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {
  title = 'frontend';
  isAdminPage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isAdminPage = e.urlAfterRedirects.startsWith('/admin');
      });
  }
}
