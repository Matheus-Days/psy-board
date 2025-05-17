import { Component, inject } from '@angular/core';
import { ProfessionalCardComponent } from '../../components/professional-card/professional-card.component';
import { UserPublicData, UserService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  imports: [MatButtonModule, ProfessionalCardComponent, RouterLink],
})
export class CardComponent {
  userService = inject(UserService);

  userData: UserPublicData;

  constructor() {
    this.userData = this.userService.userData as UserPublicData;
  }
}
