import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { masterNavigation } from './navigation/master-navigation';

@Component({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly masterNavigation = masterNavigation;
  protected readonly isMasterNavigationExpanded = signal(true);

  protected toggleMasterNavigation(): void {
    this.isMasterNavigationExpanded.update((expanded) => !expanded);
  }
}
