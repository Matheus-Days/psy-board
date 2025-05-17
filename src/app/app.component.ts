import { Component, inject, signal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CloudinaryModule } from '@cloudinary/ng';
import { UserPublicData, UserService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CloudinaryModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule,
    RouterOutlet,
  ],
})
export class AppComponent {
  matIconRegistry = inject(MatIconRegistry);
  sanitizer = inject(DomSanitizer);
  router = inject(Router);
  userService = inject(UserService);

  userData = signal<UserPublicData | undefined>(undefined);

  constructor() {
    this.matIconRegistry.addSvgIconResolver(name => {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `assets/icons/${name}.svg`
      );
    });
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
}
